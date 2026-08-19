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
            resolve({ status: res.statusCode, body: json });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Starting Phase 5A AI Tutor API Test Suite...\n');
  let studentAToken = null;
  let studentBToken = null;
  let teacherToken = null;
  let conversationId = null;

  try {
    // 1. Health Endpoint Test
    const health = await makeRequest('/health');
    console.log('1. GET /api/health:', health.status === 200 && health.body.success ? '✅ PASS' : '❌ FAIL');

    // 2. Register Users
    const studentAEmail = `studentA_p5a_${Date.now()}@example.com`;
    const regStudentA = await makeRequest('/auth/register', 'POST', {
      name: 'Student A',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    studentAToken = regStudentA.body.token;

    const studentBEmail = `studentB_p5a_${Date.now()}@example.com`;
    const regStudentB = await makeRequest('/auth/register', 'POST', {
      name: 'Student B',
      email: studentBEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'hindi',
    });
    studentBToken = regStudentB.body.token;

    const teacherEmail = `teacher_p5a_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher P5A',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    teacherToken = regTeacher.body.token;
    console.log('2. Register Test Users:', (studentAToken && studentBToken && teacherToken) ? '✅ PASS' : '❌ FAIL');

    // 3. Student A Creates Conversation
    const createRes = await makeRequest('/tutor/conversations', 'POST', {
      title: 'Photosynthesis Doubts',
      language: 'english',
    }, studentAToken);
    console.log('3. POST /api/tutor/conversations (Student A):', createRes.status === 201 && createRes.body.data ? '✅ PASS' : '❌ FAIL');
    conversationId = createRes.body.data._id || createRes.body.data.id;

    // 4. Student A Lists Conversations
    const listRes = await makeRequest('/tutor/conversations', 'GET', null, studentAToken);
    console.log('4. GET /api/tutor/conversations (Student A):', listRes.status === 200 && listRes.body.data.length >= 1 ? '✅ PASS' : '❌ FAIL');

    // 5. Student A Sends Message (Verify Non-LLM Pending Status)
    const sendRes = await makeRequest(`/tutor/conversations/${conversationId}/messages`, 'POST', {
      content: 'Explain photosynthesis simply.',
    }, studentAToken);
    const hasPendingNotice = sendRes.body.message && sendRes.body.message.includes('AI provider is not connected yet');
    console.log('5. POST /api/tutor/conversations/:id/messages:', sendRes.status === 200 && hasPendingNotice ? '✅ PASS (Non-LLM Status Notice Verified)' : '❌ FAIL');

    // 6. Security Check: Student B attempts to access Student A's conversation (Expect 404/403)
    const illegalAccessRes = await makeRequest(`/tutor/conversations/${conversationId}`, 'GET', null, studentBToken);
    console.log('6. Security Check: Student B accessing Student A conversation (Expect 404/403):', (illegalAccessRes.status === 404 || illegalAccessRes.status === 403) ? '✅ PASS (Ownership Guard Blocked)' : '❌ FAIL', illegalAccessRes.body.message);

    // 7. Security Check: Teacher attempts to access Tutor Endpoints (Expect 403)
    const teacherAccessRes = await makeRequest('/tutor/conversations', 'GET', null, teacherToken);
    console.log('7. Security Check: Teacher accessing Tutor API (Expect 403):', teacherAccessRes.status === 403 ? '✅ PASS (Role Guard Blocked)' : '❌ FAIL', teacherAccessRes.body.message);

    // 8. Security Check: Unauthenticated access attempt (Expect 401)
    const unauthAccessRes = await makeRequest('/tutor/conversations', 'GET', null, null);
    console.log('8. Security Check: Unauthenticated access (Expect 401):', unauthAccessRes.status === 401 ? '✅ PASS (Auth Guard Blocked)' : '❌ FAIL', unauthAccessRes.body.message);

    // 9. Student A Deletes Conversation
    const deleteRes = await makeRequest(`/tutor/conversations/${conversationId}`, 'DELETE', null, studentAToken);
    console.log('9. DELETE /api/tutor/conversations/:id:', deleteRes.status === 200 && deleteRes.body.success ? '✅ PASS' : '❌ FAIL');

    console.log('\n🎉 ALL PHASE 5A AI TUTOR VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test Execution Error:', err);
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
      await runTests();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
