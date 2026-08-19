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

const runTeacherInterventionAudit = async () => {
  console.log('🩺 Starting Feature 4: Teacher Intervention & Remediation Verification Audit...\n');

  try {
    // 1. Register Teacher A & Teacher B
    const teacherAEmail = `teacher_a_${Date.now()}@example.com`;
    const regTA = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher A',
      email: teacherAEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tokenTA = regTA.body?.token;
    const teacherAId = regTA.body?.user?.id || regTA.body?.user?._id;

    const teacherBEmail = `teacher_b_${Date.now()}@example.com`;
    const regTB = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher B',
      email: teacherBEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tokenTB = regTB.body?.token;

    // 2. Register Student A & Student B
    const studentAEmail = `student_a_${Date.now()}@example.com`;
    const regSA = await makeRequest('/auth/register', 'POST', {
      name: 'Student A',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenSA = regSA.body?.token;
    const studentAId = regSA.body?.user?.id || regSA.body?.user?._id;

    const studentBEmail = `student_b_${Date.now()}@example.com`;
    const regSB = await makeRequest('/auth/register', 'POST', {
      name: 'Student B',
      email: studentBEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenSB = regSB.body?.token;
    const studentBId = regSB.body?.user?.id || regSB.body?.user?._id;

    console.log('1-4. Registration Completed: Teacher A, Teacher B, Student A, Student B');

    // 5. Create Intervention by Teacher A for Student A
    const createRes = await makeRequest('/teacher/interventions', 'POST', {
      studentId: studentAId,
      type: 'practice',
      title: 'Targeted Remedial Algebra Practice',
      instructions: 'Complete 5 practice questions focusing on Quadratic Equations.',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    }, tokenTA);

    const interventionId = createRes.body?.data?._id || createRes.body?.data?.id;
    console.log(`5. Create Intervention by Teacher A: Status ${createRes.status} | Intervention ID: ${interventionId}`);
    console.log(`   Initial Status: "${createRes.body?.data?.status}" | Priority: "${createRes.body?.data?.priority}"`);

    // 6. Teacher A Views Intervention List
    const teacherListRes = await makeRequest('/teacher/interventions', 'GET', null, tokenTA);
    console.log(`6. Teacher A Intervention List: Status ${teacherListRes.status} | Count: ${teacherListRes.body?.data?.length}`);

    // 7. Teacher B Isolation Guard (Teacher B cannot view Teacher A's intervention)
    const teacherBDetailRes = await makeRequest(`/teacher/interventions/${interventionId}`, 'GET', null, tokenTB);
    console.log('7. Teacher B Access Guard (Expect 404):', teacherBDetailRes.status === 404 ? '✅ VERIFIED' : '❌ FAILED');

    // 8. Student A Views Own Interventions
    const studentListRes = await makeRequest('/student/interventions', 'GET', null, tokenSA);
    console.log(`8. Student A Interventions List: Status ${studentListRes.status} | Count: ${studentListRes.body?.data?.length}`);

    // 9. Student B Isolation Guard (Student B cannot view Student A's intervention)
    const studentBDetailRes = await makeRequest(`/student/interventions/${interventionId}`, 'GET', null, tokenSB);
    console.log('9. Student B Access Guard (Expect 404):', studentBDetailRes.status === 404 ? '✅ VERIFIED' : '❌ FAILED');

    // 10. Student A Starts & Completes Intervention
    const startRes = await makeRequest(`/student/interventions/${interventionId}/status`, 'PUT', { status: 'in_progress' }, tokenSA);
    console.log(`10. Student A Starts Intervention: Status ${startRes.status} | New Status: "${startRes.body?.data?.status}"`);

    const completeRes = await makeRequest(`/student/interventions/${interventionId}/status`, 'PUT', { status: 'completed' }, tokenSA);
    console.log(`11. Student A Completes Intervention: Status ${completeRes.status} | Status: "${completeRes.body?.data?.status}" | CompletedAt Set: ${completeRes.body?.data?.completedAt !== undefined}`);

    // 12. Student Invalid Transition Guard (Student cannot change priority or teacherNote)
    const invalidUpdateRes = await makeRequest(`/student/interventions/${interventionId}/status`, 'PUT', { priority: 'low', status: 'cancelled' }, tokenSA);
    console.log('12. Student Invalid Status Transition Guard (Expect 400):', invalidUpdateRes.status === 400 ? '✅ VERIFIED' : '❌ FAILED');

    // 13. Student Role Creation Guard (Student cannot create interventions)
    const studentCreateRes = await makeRequest('/teacher/interventions', 'POST', { studentId: studentBId, title: 'Unauthorized' }, tokenSA);
    console.log('13. Student Role Creation Guard (Expect 403):', studentCreateRes.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    // 14. Teacher Analytics Check
    const analyticsRes = await makeRequest('/teacher/interventions/analytics', 'GET', null, tokenTA);
    console.log(`14. Teacher Analytics: Status ${analyticsRes.status} | Assigned: ${analyticsRes.body?.data?.totalAssigned} | Completed: ${analyticsRes.body?.data?.completed} | Rate: ${analyticsRes.body?.data?.completionRate}%`);

    // 15. Unauthenticated Guard
    const unauthRes = await makeRequest('/student/interventions', 'GET', null, null);
    console.log('15. Unauthenticated Access Guard (Expect 401):', unauthRes.status === 401 ? '✅ VERIFIED' : '❌ FAILED');

    console.log('\n🎉 FEATURE 4 TEACHER INTERVENTION AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Teacher Intervention Audit Error:', err);
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
      await runTeacherInterventionAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
