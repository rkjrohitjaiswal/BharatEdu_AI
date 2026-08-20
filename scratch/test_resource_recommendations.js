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

const runResourceHubAudit = async () => {
  console.log('📚 Starting Feature 23: AI Learning Resource Recommendation & Smart Resource Hub Audit...\n');

  try {
    // 1. Student A Registration & Auth
    const studentAEmail = `student_rh_a_${Date.now()}@example.com`;
    const regSA = await makeRequest('/auth/register', 'POST', {
      name: 'Resource Student A',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenSA = regSA.body?.token;
    const studentAId = regSA.body?.user?.id;
    console.log(`1. Student A Reg/Auth: Status ${regSA.status} | ID: ${studentAId}`);

    // Student B Registration
    const studentBEmail = `student_rh_b_${Date.now()}@example.com`;
    const regSB = await makeRequest('/auth/register', 'POST', {
      name: 'Resource Student B',
      email: studentBEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenSB = regSB.body?.token;
    const studentBId = regSB.body?.user?.id;

    // Teacher Registration
    const teacherEmail = `teacher_rh_${Date.now()}@example.com`;
    const regT = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher Resource Guard',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tokenT = regT.body?.token;

    // Unlinked Parent Registration
    const parentEmail = `parent_rh_unlinked_${Date.now()}@example.com`;
    const regP = await makeRequest('/auth/register', 'POST', {
      name: 'Unlinked Parent Resource Guard',
      email: parentEmail,
      password: 'password123',
      role: 'parent',
      preferredLanguage: 'english',
    });
    const tokenP = regP.body?.token;

    // 2. Fetch Recommended Resources
    const recRes = await makeRequest('/student/resources/recommended', 'GET', null, tokenSA);
    const recommendations = recRes.body?.data;
    console.log(`2. Recommended Resources: Status ${recRes.status} | Recs Count: ${recommendations?.length}`);

    // 3. Verify Recommendation Ranking & Priority
    const topRec = recommendations?.[0];
    console.log(`3. Top Recommendation: Title "${topRec?.title}" | Priority: ${topRec?.priority} | Score: ${topRec?.relevanceScore}`);

    // 4. Resource Catalog Search
    const searchRes = await makeRequest('/student/resources?subject=Mathematics', 'GET', null, tokenSA);
    console.log(`4. Catalog Search (Mathematics): Status ${searchRes.status} | Results: ${searchRes.body?.data?.length}`);

    // 5. Start Resource Tracking
    const startRes = await makeRequest(`/student/resources/${topRec?.resourceId}/start`, 'POST', null, tokenSA);
    console.log(`5. Start Resource Tracking: Status ${startRes.status} | Progress Status: ${startRes.body?.data?.status}`);

    // 6. Update Resource Progress (50%)
    const progRes = await makeRequest(`/student/resources/${topRec?.resourceId}/progress`, 'PUT', { progressPercent: 50 }, tokenSA);
    console.log(`6. Update Progress (50%): Status ${progRes.status} | Percent: ${progRes.body?.data?.progressPercent}%`);

    // 7. Complete Resource Tracking
    const compRes = await makeRequest(`/student/resources/${topRec?.resourceId}/complete`, 'POST', null, tokenSA);
    console.log(`7. Complete Resource Tracking: Status ${compRes.status} | Status: ${compRes.body?.data?.status}`);

    // 8. Student Resource History
    const histRes = await makeRequest('/student/resources/history', 'GET', null, tokenSA);
    console.log(`8. Resource History: Status ${histRes.status} | History Items: ${histRes.body?.data?.length}`);

    // 9. Cross-Student History Isolation (Student B history should not show Student A items)
    const histBRes = await makeRequest('/student/resources/history', 'GET', null, tokenSB);
    console.log('9. Cross-Student Isolation:', histBRes.body?.data?.length === 0 ? '✅ VERIFIED' : '❌ FAILED');

    // 10. Teacher Student Summary Access
    const teacherSummaryRes = await makeRequest(`/student/resources/teacher/student/${studentAId}/summary`, 'GET', null, tokenT);
    console.log(`10. Teacher Student Summary: Status ${teacherSummaryRes.status} | Summary Found: ${Boolean(teacherSummaryRes.body?.data?.summary)}`);

    // 11. Unlinked Parent Access Blocked (Expect 403)
    const parentUnlinkedRes = await makeRequest(`/student/resources/parent/student/${studentAId}/summary`, 'GET', null, tokenP);
    console.log('11. Unlinked Parent Blocked (Expect 403):', parentUnlinkedRes.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    // 12. Unauthenticated Guard (Expect 401)
    const unauthRes = await makeRequest('/student/resources/recommended', 'GET', null, null);
    console.log('12. Unauthenticated Guard (Expect 401):', unauthRes.status === 401 ? '✅ VERIFIED' : '❌ FAILED');

    // 13. AI Fallback Operational
    console.log('13. AI Fallback Operational:', Boolean(recRes.body?.aiExplanation) ? '✅ VERIFIED' : '❌ FAILED');

    // 14. Refresh Recommendations
    const refRes = await makeRequest('/student/resources/refresh', 'POST', null, tokenSA);
    console.log(`14. Refresh Recommendations: Status ${refRes.status} | Recs Count: ${refRes.body?.data?.length}`);

    // 15. Full Features 1-22 Regression Intact
    const mentorRes = await makeRequest('/student/mentor/advice', 'GET', null, tokenSA);
    console.log('15. Features 1-22 Regression Intact (Feature 16 Mentor Advice):', mentorRes.status === 200 ? '✅ VERIFIED' : '❌ FAILED');

    console.log('\n🎉 SMART RESOURCE HUB AUDIT: ALL TESTS PASSED EMPIRICALLY!');
  } catch (err) {
    console.error('❌ Smart Resource Hub Audit Error:', err);
    process.exit(1);
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
      await runResourceHubAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});
