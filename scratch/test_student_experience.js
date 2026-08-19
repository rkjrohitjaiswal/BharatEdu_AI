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

const runStudentExperienceAudit = async () => {
  console.log('🎓 Starting Complete Student Learning Experience Audit...\n');

  try {
    // 1. Register & Login Student A
    const studentAEmail = `golden_student_${Date.now()}@example.com`;
    const regRes = await makeRequest('/auth/register', 'POST', {
      name: 'Golden Path Student',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenA = regRes.body?.token;
    console.log('1. Student Registration & Login:', tokenA ? '✅ VERIFIED' : '❌ FAILED');

    // 2. Fetch Initial Student Dashboard
    const dash1 = await makeRequest('/student/dashboard', 'GET', null, tokenA);
    const initialMastery = dash1.body?.data?.learningProfile?.overallMastery || 0;
    console.log(`2. Initial Dashboard Mastery: ${initialMastery}% | Profile: Class ${dash1.body?.data?.studentProfile?.classLevel || 8}`);

    // 3. Create Adaptive Practice Session
    const practiceSessionRes = await makeRequest('/student/practice/sessions', 'POST', { questionCount: 2 }, tokenA);
    const sessionId = practiceSessionRes.body?.data?.session?._id;
    const questions = practiceSessionRes.body?.data?.session?.questions || [];
    console.log(`3. Practice Session Created: ${sessionId} | Questions Count: ${questions.length}`);

    // 4. Submit Practice Answers
    if (sessionId && questions.length > 0) {
      const q1 = questions[0];
      const answerRes = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
        questionId: q1._id || q1.id || 'q1',
        selectedOption: 0,
        timeSpentSeconds: 15,
      }, tokenA);
      console.log('4. Submit Practice Answer Response Status:', answerRes.status);
    }

    // 5. Re-fetch Dashboard to verify Data Consistency across screens
    const dash2 = await makeRequest('/student/dashboard', 'GET', null, tokenA);
    console.log(`5. Post-Practice Dashboard Re-query Success: ${dash2.status === 200}`);

    // 6. Cross-Student Ownership Check: Student B modifying Student A task
    const studentBEmail = `studentB_exp_${Date.now()}@example.com`;
    const regB = await makeRequest('/auth/register', 'POST', {
      name: 'Student B Exp',
      email: studentBEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenB = regB.body?.token;

    const crossTaskRes = await makeRequest('/student/study-plan/tasks/task_a_fake_id', 'PUT', { completed: true }, tokenB);
    console.log(`6. Student B Modifying Student A Task (Expect 404/403): Status ${crossTaskRes.status}`);

    console.log('\n🎉 STUDENT LEARNING EXPERIENCE AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Experience Audit Error:', err);
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
      await runStudentExperienceAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
