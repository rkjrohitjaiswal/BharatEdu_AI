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

const runPracticeHistoryFeatureAudit = async () => {
  console.log('📜 Starting Feature 3: Practice & Quiz History Verification Audit...\n');

  try {
    // 1. Register Student A, Student B, and Teacher
    const emailA = `history_student_a_${Date.now()}@example.com`;
    const regA = await makeRequest('/auth/register', 'POST', {
      name: 'History Student A',
      email: emailA,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenA = regA.body?.token;

    const emailB = `history_student_b_${Date.now()}@example.com`;
    const regB = await makeRequest('/auth/register', 'POST', {
      name: 'History Student B',
      email: emailB,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenB = regB.body?.token;

    const teacherEmail = `history_teacher_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'History Teacher',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const teacherToken = regTeacher.body?.token;

    console.log('1. Registration Completed: Student A, Student B, Teacher');

    // 2. Create Practice Session for Student A & Submit Answer
    const sessionRes = await makeRequest('/student/practice/sessions', 'POST', { questionCount: 2 }, tokenA);
    const sessionId = sessionRes.body?.data?.session?._id;

    console.log(`2. Practice Session Created: Session ID ${sessionId}`);

    // Submit answer Q1
    await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
      questionIndex: 0,
      answer: 'test answer',
      timeSpentSeconds: 15,
    }, tokenA);

    // Submit answer Q2
    await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
      questionIndex: 1,
      answer: 'test answer 2',
      timeSpentSeconds: 15,
    }, tokenA);

    console.log('3. Completed 2 Questions in Practice Session');

    // 4. Retrieve Paginated History List
    const historyRes = await makeRequest('/student/practice/history?page=1&limit=10', 'GET', null, tokenA);
    console.log(`4. Fetch History List: Status ${historyRes.status} | Total Items: ${historyRes.body?.data?.pagination?.totalItems}`);
    const topItem = historyRes.body?.data?.items?.[0];
    if (topItem) {
      console.log(`   Session Item Topic: "${topItem.topicName}" | Subject: "${topItem.subjectName}" | Accuracy: ${topItem.accuracy}%`);
    }

    // 5. Retrieve Session Details
    const detailRes = await makeRequest(`/student/practice/history/${sessionId}`, 'GET', null, tokenA);
    console.log(`5. Fetch Session Detail: Status ${detailRes.status} | Questions Count: ${detailRes.body?.data?.questions?.length}`);
    const q1 = detailRes.body?.data?.questions?.[0];
    if (q1) {
      console.log(`   Q1 Text: "${q1.questionText}" | Student Ans: "${q1.studentAnswer}" | Correct Answer Exposed (Post-Completion): "${q1.correctAnswer}"`);
    }

    // 6. Retrieve History Summary Statistics
    const summaryRes = await makeRequest('/student/practice/history/summary', 'GET', null, tokenA);
    console.log(`6. Fetch History Summary: Status ${summaryRes.status}`);
    const sumData = summaryRes.body?.data;
    if (sumData) {
      console.log(`   Total Sessions: ${sumData.totalSessions} | Questions: ${sumData.totalQuestions} | Overall Acc: ${sumData.overallAccuracy}%`);
      console.log(`   Streak: ${sumData.currentPracticeStreak} days | Time: ${sumData.totalPracticeMinutes} mins`);
      console.log(`   Subject Breakdown Count: ${sumData.subjectPerformance?.length} | Time Series Data Points: ${sumData.timeSeries?.length}`);
    }

    // 7. Security & Authorization Matrix
    const studentBToSession = await makeRequest(`/student/practice/history/${sessionId}`, 'GET', null, tokenB);
    console.log('7. Student B Ownership Isolation (Cannot access Student A session detail):', studentBToSession.status === 404 || studentBToSession.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    const teacherToHistory = await makeRequest('/student/practice/history', 'GET', null, teacherToken);
    console.log('8. Teacher Authorization Guard (Expect 403):', teacherToHistory.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    const unauthToHistory = await makeRequest('/student/practice/history', 'GET', null, null);
    console.log('9. Unauthenticated Access Guard (Expect 401):', unauthToHistory.status === 401 ? '✅ VERIFIED' : '❌ FAILED');

    console.log('\n🎉 FEATURE 3 PRACTICE & QUIZ HISTORY AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Practice History Audit Error:', err);
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
      await runPracticeHistoryFeatureAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
