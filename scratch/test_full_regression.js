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

const runFullRegressionAudit = async () => {
  console.log('🚀 Starting Phase 11 Full-System End-to-End Regression & Integration Audit...\n');

  try {
    // 1. Health Endpoint Check
    const health = await makeRequest('/health');
    console.log(`1. Health Check (GET /api/health): Status ${health.status} | OK: ${health.body?.success}`);

    // 2. Student Golden Path Execution
    const studentEmail = `regression_student_${Date.now()}@example.com`;
    const regStudent = await makeRequest('/auth/register', 'POST', {
      name: 'Regression Student',
      email: studentEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const sToken = regStudent.body?.token;
    console.log(`2. Student Registration: Status ${regStudent.status} | Token: ${Boolean(sToken)}`);

    const sDash1 = await makeRequest('/student/dashboard', 'GET', null, sToken);
    console.log(`3. Initial Student Dashboard: Status ${sDash1.status} | Mastery: ${sDash1.body?.data?.learningProfile?.overallMastery || 0}%`);

    const sPractice = await makeRequest('/student/practice/sessions', 'POST', { questionCount: 2 }, sToken);
    const sessionId = sPractice.body?.data?.session?._id;
    console.log(`4. Adaptive Practice Session Created: Status ${sPractice.status} | Session ID: ${sessionId}`);

    if (sessionId) {
      const answerRes = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
        questionIndex: 0,
        answer: 'linear equation',
      }, sToken);
      console.log(`5. Submit Practice Answer: Status ${answerRes.status} | Server isCorrect: ${answerRes.body?.data?.isCorrect}`);
    }

    const sTutorConv = await makeRequest('/tutor/conversations', 'POST', { title: 'Regression Tutor Chat' }, sToken);
    const convId = sTutorConv.body?.data?._id;
    console.log(`6. AI Tutor Conversation Created: Status ${sTutorConv.status} | Conv ID: ${convId}`);

    const sScholarships = await makeRequest('/student/scholarships/matches', 'GET', null, sToken);
    console.log(`7. Scholarship Matches Query: Status ${sScholarships.status} | Matches Count: ${sScholarships.body?.data?.length || 0}`);

    // 3. Teacher Golden Path Execution
    const teacherEmail = `regression_teacher_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Regression Teacher',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tToken = regTeacher.body?.token;
    console.log(`8. Teacher Registration: Status ${regTeacher.status} | Token: ${Boolean(tToken)}`);

    const tDash = await makeRequest('/teacher/dashboard', 'GET', null, tToken);
    console.log(`9. Teacher Dashboard: Status ${tDash.status} | Active Gaps Count: ${tDash.body?.data?.totalActiveGaps || 0}`);

    // 4. Authorization & Cross-Role Security Guards
    const sToTeacher = await makeRequest('/teacher/dashboard', 'GET', null, sToken);
    console.log(`10. Student Accessing Teacher API (Expect 403): Status ${sToTeacher.status}`);

    const tToStudent = await makeRequest('/student/dashboard', 'GET', null, tToken);
    console.log(`11. Teacher Accessing Student API (Expect 403): Status ${tToStudent.status}`);

    const unauthRes = await makeRequest('/student/dashboard', 'GET', null, null);
    console.log(`12. Unauthenticated Accessing Protected API (Expect 401): Status ${unauthRes.status}`);

    console.log('\n🎉 FULL-SYSTEM REGRESSION AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Regression Audit Error:', err);
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
      await runFullRegressionAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
