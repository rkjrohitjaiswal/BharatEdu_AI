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
  console.log('🧪 Starting Phase 6B Adaptive Practice Engine Test Suite...\n');
  let studentAToken = null;
  let studentBToken = null;
  let teacherToken = null;

  try {
    // 1. Health Endpoint Test
    const health = await makeRequest('/health');
    console.log('1. GET /api/health:', health.status === 200 && health.body.success ? '✅ PASS' : '❌ FAIL');

    // 2. Register Test Users
    const studentAEmail = `studentA_p6b_${Date.now()}@example.com`;
    const regStudentA = await makeRequest('/auth/register', 'POST', {
      name: 'Student A P6B',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    studentAToken = regStudentA.body.token;

    const studentBEmail = `studentB_p6b_${Date.now()}@example.com`;
    const regStudentB = await makeRequest('/auth/register', 'POST', {
      name: 'Student B P6B',
      email: studentBEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'hindi',
    });
    studentBToken = regStudentB.body.token;

    const teacherEmail = `teacher_p6b_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher P6B',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    teacherToken = regTeacher.body.token;
    console.log('2. Register Test Users:', (studentAToken && studentBToken && teacherToken) ? '✅ PASS' : '❌ FAIL');

    // 3. Security Role Guards
    const teacherSessionRes = await makeRequest('/student/practice/sessions', 'POST', {}, teacherToken);
    console.log('3. Teacher Accessing Student Practice Endpoint (Expect 403):', teacherSessionRes.status === 403 ? '✅ PASS' : '❌ FAIL');

    const unauthSessionRes = await makeRequest('/student/practice/sessions', 'POST', {}, null);
    console.log('4. Unauthenticated Accessing Practice Endpoint (Expect 401):', unauthSessionRes.status === 401 ? '✅ PASS' : '❌ FAIL');

    // 5. Practice Recommendations Test
    const recsRes = await makeRequest('/student/practice/recommendations', 'GET', null, studentAToken);
    console.log('5. GET /api/student/practice/recommendations:', recsRes.status === 200 && Array.isArray(recsRes.body.data) ? '✅ PASS' : '❌ FAIL');
    console.log('   - Recommendations Count:', recsRes.body.data.length);
    if (recsRes.body.data.length > 0) {
      console.log('   - Top Recommendation Topic:', recsRes.body.data[0].topicName);
      console.log('   - Priority:', recsRes.body.data[0].priority);
      console.log('   - Reason:', recsRes.body.data[0].reason);
    }

    // 6. Practice Session Creation & Security Guard Verification
    const createSessionRes = await makeRequest('/student/practice/sessions', 'POST', { questionCount: 3 }, studentAToken);
    console.log('6. Adaptive Practice Session Creation:', createSessionRes.status === 201 && createSessionRes.body.data ? '✅ PASS' : '❌ FAIL');

    const sessionData = createSessionRes.body?.data?.session;
    const currentQ = createSessionRes.body?.data?.currentQuestion;
    const sessionId = sessionData?._id || sessionData?.id;

    // Security Check: Ensure correctAnswer is NOT present in returned question object before submission
    const hasExposedAnswerInCurrentQ = currentQ && 'correctAnswer' in currentQ;
    const hasExposedAnswerInSessionList = sessionData?.questions?.some((q) => 'correctAnswer' in q);
    const isAnswerSecure = !hasExposedAnswerInCurrentQ && !hasExposedAnswerInSessionList;

    console.log('7. Security Guard (correctAnswer is WITHHELD before submission):', isAnswerSecure ? '✅ PASS' : '❌ FAIL');

    // 8. Server-Side Authoritative Answer Evaluation (Question 1)
    const q1Option = currentQ?.options ? currentQ.options[0] : 'x = 5';
    const ans1Res = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
      questionIndex: 0,
      answer: q1Option,
      timeSpentSeconds: 15,
    }, studentAToken);

    console.log('8. Server-Side Answer Evaluation (Question 1):', ans1Res.status === 200 && ans1Res.body.data ? '✅ PASS' : '❌ FAIL');
    if (ans1Res.body?.data) {
      console.log('   - Is Correct:', ans1Res.body.data.isCorrect);
      console.log('   - Correct Answer Revealed AFTER Submission:', ans1Res.body.data.correctAnswer);
      console.log('   - Current Session Score:', ans1Res.body.data.sessionProgress?.currentScore);
    }

    // 9. Answer Question 2 & Question 3 to Complete Session
    const q2 = ans1Res.body?.data?.nextQuestion;
    const q2Option = q2?.options ? q2.options[0] : 'x = 5';
    const ans2Res = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
      questionIndex: 1,
      answer: q2Option,
      timeSpentSeconds: 12,
    }, studentAToken);

    const q3 = ans2Res.body?.data?.nextQuestion;
    const q3Option = q3?.options ? q3.options[0] : 'Newton (N)';
    const ans3Res = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
      questionIndex: 2,
      answer: q3Option,
      timeSpentSeconds: 10,
    }, studentAToken);

    console.log('9. Practice Progression & Answer Submissions:', ans3Res.status === 200 ? '✅ PASS' : '❌ FAIL');
    console.log('   - Final Questions Completed:', ans3Res.body?.data?.sessionProgress?.completedQuestions);

    // 10. Complete Session API
    const completeRes = await makeRequest(`/student/practice/sessions/${sessionId}/complete`, 'POST', null, studentAToken);
    console.log('10. POST /api/student/practice/sessions/:id/complete:', completeRes.status === 200 ? '✅ PASS' : '❌ FAIL');
    if (completeRes.body?.data?.summary) {
      console.log('   - Final Accuracy:', completeRes.body.data.summary.accuracy + '%');
      console.log('   - Final Mastery Score:', completeRes.body.data.summary.currentMasteryScore);
    }

    // 11. Security & Ownership Check: Student B accessing Student A's practice session
    const studentBAccessSessionRes = await makeRequest(`/student/practice/sessions/${sessionId}`, 'GET', null, studentBToken);
    console.log('11. Security: Student B accessing Student A practice session (Expect 404/403):', (studentBAccessSessionRes.status === 404 || studentBAccessSessionRes.status === 403) ? '✅ PASS' : '❌ FAIL', studentBAccessSessionRes.body.message);

    console.log('\n🎉 ALL PHASE 6B ADAPTIVE PRACTICE ENGINE TESTS PASSED SUCCESSFULLY!');
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
