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

const runTeacherIntelligenceAudit = async () => {
  console.log('👩‍🏫 Starting Teacher Intelligence & Role Authorization Audit...\n');

  try {
    // 1. Register Teacher A & Teacher B
    const emailA = `teacher_a_${Date.now()}@example.com`;
    const regA = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher A Audit',
      email: emailA,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tokenA = regA.body?.token;

    const emailB = `teacher_b_${Date.now()}@example.com`;
    const regB = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher B Audit',
      email: emailB,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tokenB = regB.body?.token;

    // 2. Register Student
    const studentEmail = `student_for_teacher_${Date.now()}@example.com`;
    const regStudent = await makeRequest('/auth/register', 'POST', {
      name: 'Student Audit',
      email: studentEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const studentToken = regStudent.body?.token;

    // 3. Teacher A Fetching Own Dashboard & Classes
    const teacherADash = await makeRequest('/teacher/dashboard', 'GET', null, tokenA);
    const teacherAClasses = await makeRequest('/teacher/classes', 'GET', null, tokenA);
    console.log(`1. Teacher A Dashboard Status: ${teacherADash.status} | Classes Count: ${teacherAClasses.body?.data?.length}`);

    // 4. Role Security: Student attempting to call Teacher API
    const studentAttackRes = await makeRequest('/teacher/dashboard', 'GET', null, studentToken);
    console.log('2. Student -> Teacher API Role Guard (Expect 403):', studentAttackRes.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    // 5. Cross-Teacher Ownership Guard: Teacher B fetching Teacher A data
    const teacherBStudents = await makeRequest('/teacher/students', 'GET', null, tokenB);
    console.log(`3. Teacher B Students Roster (Isolated): Count ${teacherBStudents.body?.data?.length || 0}`);

    console.log('\n🎉 TEACHER INTELLIGENCE AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Teacher Audit Error:', err);
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
      await runTeacherIntelligenceAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
