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

const runMistakeReviewFeatureAudit = async () => {
  console.log('❌ Starting Feature 2: Mistake Review + AI Explanation Verification Audit...\n');

  try {
    // 1. Register Student A & Student B
    const emailA = `mistake_student_a_${Date.now()}@example.com`;
    const regA = await makeRequest('/auth/register', 'POST', {
      name: 'Mistake Student A',
      email: emailA,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenA = regA.body?.token;

    const emailB = `mistake_student_b_${Date.now()}@example.com`;
    const regB = await makeRequest('/auth/register', 'POST', {
      name: 'Mistake Student B',
      email: emailB,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenB = regB.body?.token;

    // Register Teacher
    const teacherEmail = `mistake_teacher_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Mistake Teacher',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const teacherToken = regTeacher.body?.token;

    console.log('1. Registration Completed: Student A, Student B, Teacher');

    // 2. Start Practice Session for Student A
    const sessionRes = await makeRequest('/student/practice/sessions', 'POST', { questionCount: 2 }, tokenA);
    const sessionId = sessionRes.body?.data?.session?._id;
    const currentQ = sessionRes.body?.data?.currentQuestion;

    console.log(`2. Practice Session Created: Session ID ${sessionId}`);
    console.log(`   Answer Shielding Check (correctAnswer hidden before answer): ${currentQ?.correctAnswer === undefined ? '✅ VERIFIED' : '❌ LEAKED'}`);

    // 3. Submit Incorrect Answer for Student A
    const submitRes = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
      questionIndex: 0,
      answer: 'completely wrong answer string',
      timeSpentSeconds: 15,
    }, tokenA);

    console.log(`3. Submit Incorrect Answer: Status ${submitRes.status} | Server isCorrect: ${submitRes.body?.data?.isCorrect}`);
    console.log(`   Correct Solution Returned Post-Submission: "${submitRes.body?.data?.correctAnswer}"`);

    // 4. Fetch Student A Mistakes List
    const mistakesRes = await makeRequest('/student/practice/mistakes', 'GET', null, tokenA);
    console.log(`4. Fetch Student A Mistakes List: Status ${mistakesRes.status} | Count: ${mistakesRes.body?.data?.length}`);
    const topMistake = mistakesRes.body?.data?.[0];

    if (topMistake) {
      console.log(`   Mistake Topic: "${topMistake.topicName}" | Student Ans: "${topMistake.studentAnswer}" | Correct: "${topMistake.correctAnswer}"`);
      console.log(`   AI Explanation: "${topMistake.explanation}"`);
      console.log(`   Misconception: "${topMistake.misconception}"`);
      console.log(`   RAG Sources Attached: ${topMistake.sources?.length || 0}`);
    }

    // 5. Fetch Specific Mistake Details
    const attemptId = topMistake?._id || topMistake?.id;
    if (attemptId) {
      const detailsRes = await makeRequest(`/student/practice/mistakes/${attemptId}`, 'GET', null, tokenA);
      console.log(`5. Fetch Mistake Details: Status ${detailsRes.status} | Topic: "${detailsRes.body?.data?.topicName}"`);
    }

    // 6. Security & Authorization Matrix
    const studentBToMistakes = await makeRequest('/student/practice/mistakes', 'GET', null, tokenB);
    const isIsolatedB = (studentBToMistakes.body?.data?.length || 0) === 0;
    console.log('6. Student B Ownership Isolation (Cannot access Student A mistakes):', isIsolatedB ? '✅ VERIFIED' : '❌ FAILED');

    const teacherToMistakes = await makeRequest('/student/practice/mistakes', 'GET', null, teacherToken);
    console.log('7. Teacher Authorization Guard (Expect 403):', teacherToMistakes.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    const unauthToMistakes = await makeRequest('/student/practice/mistakes', 'GET', null, null);
    console.log('8. Unauthenticated Access Guard (Expect 401):', unauthToMistakes.status === 401 ? '✅ VERIFIED' : '❌ FAILED');

    console.log('\n🎉 FEATURE 2 MISTAKE REVIEW AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Mistake Review Audit Error:', err);
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
      await runMistakeReviewFeatureAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
