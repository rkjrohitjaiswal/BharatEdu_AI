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

const runAdaptivePracticeAudit = async () => {
  console.log('🎯 Starting Adaptive Practice Engine & Security Audit...\n');

  try {
    // 1. Register Student A & Student B
    const emailA = `practice_student_a_${Date.now()}@example.com`;
    const regA = await makeRequest('/auth/register', 'POST', {
      name: 'Practice Student A',
      email: emailA,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenA = regA.body?.token;

    const emailB = `practice_student_b_${Date.now()}@example.com`;
    const regB = await makeRequest('/auth/register', 'POST', {
      name: 'Practice Student B',
      email: emailB,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenB = regB.body?.token;

    // 2. Student A Creates Practice Session
    const sessionRes = await makeRequest('/student/practice/sessions', 'POST', { questionCount: 2 }, tokenA);
    const session = sessionRes.body?.data?.session;
    const sessionId = session?._id || session?.id;
    const firstQuestion = session?.questions?.[0];

    // 3. Security Audit: Check if correctAnswer is stripped from client payload
    const hasCorrectAnswerField = 'correctAnswer' in (firstQuestion || {});
    console.log('1. Answer Security (correctAnswer hidden before submission):', !hasCorrectAnswerField ? '✅ VERIFIED' : '❌ FAILED');

    // 4. Session Ownership Security: Student B attempts to submit answer to Student A session
    const studentBAttackRes = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
      questionIndex: 0,
      answer: 'attack_answer',
    }, tokenB);
    console.log(`2. Session Ownership Guard (Student B -> Student A Session Expect 404/403): Status ${studentBAttackRes.status} | Msg: "${studentBAttackRes.body?.message}"`);

    // 5. Client Manipulation Defense: Student A attempts to pass client-forced `isCorrect: true` and `score: 100`
    const attackBodyRes = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
      questionIndex: 0,
      answer: 'sample_answer',
      isCorrect: true, // Client trying to cheat
      score: 100,
      masteryScore: 100,
    }, tokenA);
    console.log(`3. Client Manipulation Defense (Backend evaluates answer server-side): Status ${attackBodyRes.status} | Server Calculated isCorrect: ${attackBodyRes.body?.data?.isCorrect}`);

    console.log('\n🎉 ADAPTIVE PRACTICE AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Practice Audit Error:', err);
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
      await runAdaptivePracticeAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
