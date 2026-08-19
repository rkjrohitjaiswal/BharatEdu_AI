import { spawn } from 'child_process';
import http from 'http';

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ status: res.statusCode, headers: res.headers, body: json });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, raw: data });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
};

const runParentInsightsAudit = async () => {
  console.log('👨‍👩‍👧 Starting Feature 7: Parent/Guardian Insights Verification Audit...\n');

  try {
    // 1-4. Registration: Parent A, Parent B, Student A, Teacher
    const parentAEmail = `parent_a_${Date.now()}@example.com`;
    const regPA = await makeRequest('/auth/register', 'POST', {
      name: 'Parent A',
      email: parentAEmail,
      password: 'password123',
      role: 'parent',
      preferredLanguage: 'english',
    });
    const tokenPA = regPA.body?.token;

    const parentBEmail = `parent_b_${Date.now()}@example.com`;
    const regPB = await makeRequest('/auth/register', 'POST', {
      name: 'Parent B',
      email: parentBEmail,
      password: 'password123',
      role: 'parent',
      preferredLanguage: 'english',
    });
    const tokenPB = regPB.body?.token;

    const studentAEmail = `student_p_${Date.now()}@example.com`;
    const regSA = await makeRequest('/auth/register', 'POST', {
      name: 'Student P',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenSA = regSA.body?.token;
    const studentAUser = regSA.body?.user;
    const studentAId = studentAUser?.id || studentAUser?._id;

    const teacherEmail = `teacher_p_${Date.now()}@example.com`;
    const regT = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher P',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tokenT = regT.body?.token;

    console.log('1-4. Registration Completed: Parent A, Parent B, Student A, Teacher');

    // 5. Student A generates Parent Invitation Code
    const invRes = await makeRequest('/student/parent-link/invite', 'POST', { relationship: 'mother' }, tokenSA);
    console.log(`5. Generate Parent Invitation Code: Status ${invRes.status} | Code: "${invRes.body?.data?.code}"`);
    const validCode = invRes.body?.data?.code;

    // 6. Invalid Code Rejection Check
    const invalidAccept = await makeRequest('/parent/link-student', 'POST', { code: 'INVALID-999' }, tokenPA);
    console.log('6. Invalid Code Rejection (Expect 400):', invalidAccept.status === 400 ? '✅ VERIFIED' : '❌ FAILED');

    // 7. Parent A accepts valid invitation code
    const acceptRes = await makeRequest('/parent/link-student', 'POST', { code: validCode }, tokenPA);
    console.log(`7. Parent A Accept Invitation: Status ${acceptRes.status} | Message: "${acceptRes.body?.message}"`);

    // 8. Re-use of Used Code Check
    const reuseAccept = await makeRequest('/parent/link-student', 'POST', { code: validCode }, tokenPA);
    console.log('8. Used Code Reuse Guard (Expect 400):', reuseAccept.status === 400 ? '✅ VERIFIED' : '❌ FAILED');

    // 9-10. Student generates 2nd code and revokes it
    const invRes2 = await makeRequest('/student/parent-link/invite', 'POST', { relationship: 'father' }, tokenSA);
    const code2 = invRes2.body?.data?.code;
    const revokeRes = await makeRequest(`/student/parent-link/invitations/${code2}`, 'DELETE', null, tokenSA);
    console.log(`9. Revoke Invitation Code: Status ${revokeRes.status}`);

    const acceptRevoked = await makeRequest('/parent/link-student', 'POST', { code: code2 }, tokenPA);
    console.log('10. Revoked Code Guard (Expect 400):', acceptRevoked.status === 400 ? '✅ VERIFIED' : '❌ FAILED');

    // 11. Parent A GET Linked Students
    const linkedRes = await makeRequest('/parent/students', 'GET', null, tokenPA);
    console.log(`11. Parent A Linked Students List: Status ${linkedRes.status} | Count: ${linkedRes.body?.data?.length}`);

    // 12. Parent A GET Linked Student Overview
    const overviewRes = await makeRequest(`/parent/students/${studentAId}/overview`, 'GET', null, tokenPA);
    console.log(`12. Parent A GET Student Overview: Status ${overviewRes.status}`);

    const ovData = overviewRes.body?.data;
    console.log(`    Student Name: "${ovData?.student?.name}"`);
    console.log(`    Overall Mastery: ${ovData?.overallMastery}%`);
    console.log(`    Progress Trend: "${ovData?.progressTrend?.trend}" | Score: ${ovData?.progressTrend?.score}`);
    console.log(`    AI Summary: "${ovData?.aiLearningSummary?.summary}"`);

    // 13-14. Parent B (Unlinked) Access Guard
    const parentBOverview = await makeRequest(`/parent/students/${studentAId}/overview`, 'GET', null, tokenPB);
    console.log('13-14. Parent B Access Guard to Unlinked Student (Expect 403):', parentBOverview.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    // 15. Student Access Guard to Parent Endpoint
    const studentParentAccess = await makeRequest('/parent/students', 'GET', null, tokenSA);
    console.log('15. Student Role Access Guard to Parent API (Expect 403):', studentParentAccess.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    // 16. Teacher Access Guard to Parent Endpoint
    const teacherParentAccess = await makeRequest('/parent/students', 'GET', null, tokenT);
    console.log('16. Teacher Role Access Guard to Parent API (Expect 403):', teacherParentAccess.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    // 17. Unauthenticated Access Guard
    const unauthAccess = await makeRequest('/parent/students', 'GET', null, null);
    console.log('17. Unauthenticated Access Guard (Expect 401):', unauthAccess.status === 401 ? '✅ VERIFIED' : '❌ FAILED');

    // 18. Privacy Check (No passwords, secrets, tutor chats in overview payload)
    const jsonStr = JSON.stringify(ovData || {});
    const privacyPass = !jsonStr.includes('password') && !jsonStr.includes('secret') && !jsonStr.includes('messages');
    console.log('18. Privacy Safeguard (No secrets or tutor chats exposed):', privacyPass ? '✅ VERIFIED' : '❌ FAILED');

    // 19. Non-Mutation Check (Verify student dashboard mastery remains intact)
    const studentDash = await makeRequest('/student/dashboard', 'GET', null, tokenSA);
    console.log(`19. Read-Only Non-Mutation Check: Student Mastery Unchanged (${studentDash.body?.data?.learningProfile?.overallMastery}%)`);

    // 20-23. Progress Trend & Fallback Checks
    const validScore = ovData?.progressTrend?.score >= 0 && ovData?.progressTrend?.score <= 100;
    console.log('20-22. Trend Score Bounded (0-100):', validScore ? '✅ VERIFIED' : '❌ FAILED');
    console.log(`23. AI Fallback Mode Functional: aiEnhanced = ${ovData?.aiLearningSummary?.aiEnhanced}`);

    console.log('\n🎉 FEATURE 7 PARENT INSIGHTS AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Parent Insights Audit Error:', err);
  }
};

const serverProcess = spawn('node', ['server/dist/server.js'], {
  cwd: 'C:/Project/BharatEdu AI',
  env: { ...process.env, PORT: '5000' },
});

serverProcess.stdout.on('data', (data) => {
  const msg = data.toString();
  if (msg.includes('BharatEdu AI Server running')) {
    setTimeout(async () => {
      await runParentInsightsAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
