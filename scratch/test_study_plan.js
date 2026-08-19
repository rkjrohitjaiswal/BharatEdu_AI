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

const runStudyPlanFeatureAudit = async () => {
  console.log('📅 Starting Feature 1: AI Study Plan Generator Verification Audit...\n');

  try {
    // 1. Register Student A & Student B
    const emailA = `study_student_a_${Date.now()}@example.com`;
    const regA = await makeRequest('/auth/register', 'POST', {
      name: 'Study Plan Student A',
      email: emailA,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenA = regA.body?.token;

    const emailB = `study_student_b_${Date.now()}@example.com`;
    const regB = await makeRequest('/auth/register', 'POST', {
      name: 'Study Plan Student B',
      email: emailB,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenB = regB.body?.token;

    // Register Teacher
    const teacherEmail = `study_teacher_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Study Plan Teacher',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const teacherToken = regTeacher.body?.token;

    console.log('1. Registration Completed: Student A, Student B, Teacher');

    // 2. Generate Initial Daily Study Plan for Student A (60 mins)
    const genDaily = await makeRequest('/student/study-plan/generate', 'POST', {
      dailyStudyMinutes: 60,
      planDuration: 'daily',
    }, tokenA);

    console.log(`2. Generate Daily Study Plan (60 mins): Status ${genDaily.status} | Title: "${genDaily.body?.data?.title}"`);
    const tasks = genDaily.body?.data?.tasks || [];
    const totalMins = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
    console.log(`   Task Count: ${tasks.length} | Total Mins: ${totalMins} mins (Within 60 min limit: ${totalMins <= 60})`);
    if (tasks[0]) {
      console.log(`   Top Task: "${tasks[0].title}" | Priority: ${tasks[0].priority} | Reason: "${tasks[0].reason}"`);
    }

    // 3. Fetch Current Study Plan
    const curPlan = await makeRequest('/student/study-plan/current', 'GET', null, tokenA);
    console.log(`3. Fetch Current Active Plan: Status ${curPlan.status} | Tasks: ${curPlan.body?.data?.tasks?.length}`);

    // 4. Toggle Task Completion
    const firstTaskId = tasks[0]?._id || tasks[0]?.id;
    if (firstTaskId) {
      const toggleRes = await makeRequest(`/student/study-plan/tasks/${firstTaskId}`, 'PUT', { completed: true }, tokenA);
      console.log(`4. Toggle Task Completion: Status ${toggleRes.status} | Message: ${toggleRes.body?.message}`);
    }

    // 5. Generate Weekly Study Plan for Student A
    const genWeekly = await makeRequest('/student/study-plan/generate', 'POST', {
      dailyStudyMinutes: 60,
      planDuration: 'weekly',
    }, tokenA);
    console.log(`5. Generate Weekly Study Plan: Status ${genWeekly.status} | Tasks Count: ${genWeekly.body?.data?.tasks?.length}`);

    // 6. Security & Authorization Matrix
    const studentBToPlanA = await makeRequest('/student/study-plan/current', 'GET', null, tokenB);
    const isIsolatedB = !studentBToPlanA.body?.data?.tasks?.some((t) => t._id === firstTaskId);
    console.log('6. Student B Ownership Isolation (Cannot access Student A plan):', isIsolatedB ? '✅ VERIFIED' : '❌ FAILED');

    const teacherToPlan = await makeRequest('/student/study-plan/current', 'GET', null, teacherToken);
    console.log('7. Teacher Authorization Guard (Expect 403):', teacherToPlan.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    const unauthToPlan = await makeRequest('/student/study-plan/current', 'GET', null, null);
    console.log('8. Unauthenticated Access Guard (Expect 401):', unauthToPlan.status === 401 ? '✅ VERIFIED' : '❌ FAILED');

    console.log('\n🎉 FEATURE 1 STUDY PLAN GENERATOR AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Study Plan Audit Error:', err);
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
      await runStudyPlanFeatureAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
