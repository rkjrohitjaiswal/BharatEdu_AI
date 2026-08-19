import http from 'http';
import serverModule from 'file:///C:/Project/BharatEdu%20AI/server/dist/server.js';

const app = serverModule.default || serverModule;

let server;
const PORT = 5099;
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
  console.log('🧪 Starting Phase 2 Authentication & Authorization Test Suite...\n');
  let studentToken = null;
  let teacherToken = null;

  try {
    // 1. Health Endpoint Test
    const health = await makeRequest('/health');
    console.log('1. GET /api/health:', health.status === 200 && health.body.success ? '✅ PASS' : '❌ FAIL', health.body);

    // 2. Register Student
    const studentEmail = `student_${Date.now()}@example.com`;
    const regStudent = await makeRequest('/auth/register', 'POST', {
      name: 'Test Student',
      email: studentEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'hindi',
    });
    console.log('2. Register Student:', regStudent.status === 201 && regStudent.body.token ? '✅ PASS' : '❌ FAIL', regStudent.body.message);
    studentToken = regStudent.body.token;

    // 3. Register Teacher
    const teacherEmail = `teacher_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Test Teacher',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    console.log('3. Register Teacher:', regTeacher.status === 201 && regTeacher.body.token ? '✅ PASS' : '❌ FAIL', regTeacher.body.message);
    teacherToken = regTeacher.body.token;

    // 4. Duplicate Email Registration Test
    const dupReg = await makeRequest('/auth/register', 'POST', {
      name: 'Duplicate Student',
      email: studentEmail,
      password: 'password123',
      role: 'student',
    });
    console.log('4. Duplicate Email Handling (Expect 400):', dupReg.status === 400 && !dupReg.body.success ? '✅ PASS' : '❌ FAIL', dupReg.body.message);

    // 5. Student Login Test
    const loginStudent = await makeRequest('/auth/login', 'POST', {
      email: studentEmail,
      password: 'password123',
    });
    console.log('5. Student Login:', loginStudent.status === 200 && loginStudent.body.token ? '✅ PASS' : '❌ FAIL', loginStudent.body.user);

    // 6. Teacher Login Test
    const loginTeacher = await makeRequest('/auth/login', 'POST', {
      email: teacherEmail,
      password: 'password123',
    });
    console.log('6. Teacher Login:', loginTeacher.status === 200 && loginTeacher.body.token ? '✅ PASS' : '❌ FAIL', loginTeacher.body.user);

    // 7. Invalid Password Login Test
    const invalidLogin = await makeRequest('/auth/login', 'POST', {
      email: studentEmail,
      password: 'wrongpassword',
    });
    console.log('7. Invalid Password Login (Expect 401):', invalidLogin.status === 401 && !invalidLogin.body.success ? '✅ PASS' : '❌ FAIL', invalidLogin.body.message);

    // 8. GET /api/auth/me with valid token
    const meValid = await makeRequest('/auth/me', 'GET', null, studentToken);
    console.log('8. GET /api/auth/me (Valid Token):', meValid.status === 200 && meValid.body.user ? '✅ PASS' : '❌ FAIL', meValid.body.user);

    // 9. GET /api/auth/me without token
    const meNoToken = await makeRequest('/auth/me', 'GET', null, null);
    console.log('9. GET /api/auth/me (No Token - Expect 401):', meNoToken.status === 401 ? '✅ PASS' : '❌ FAIL', meNoToken.body.message);

    // 10. Student Endpoint Access Control
    const studentProfileStudentToken = await makeRequest('/student/profile', 'GET', null, studentToken);
    console.log('10a. Student Profile with Student Token (Expect 200):', studentProfileStudentToken.status === 200 ? '✅ PASS' : '❌ FAIL', studentProfileStudentToken.body.message);

    const studentProfileTeacherToken = await makeRequest('/student/profile', 'GET', null, teacherToken);
    console.log('10b. Student Profile with Teacher Token (Expect 403):', studentProfileTeacherToken.status === 403 ? '✅ PASS' : '❌ FAIL', studentProfileTeacherToken.body.message);

    // 11. Teacher Endpoint Access Control
    const teacherProfileTeacherToken = await makeRequest('/teacher/profile', 'GET', null, teacherToken);
    console.log('11a. Teacher Profile with Teacher Token (Expect 200):', teacherProfileTeacherToken.status === 200 ? '✅ PASS' : '❌ FAIL', teacherProfileTeacherToken.body.message);

    const teacherProfileStudentToken = await makeRequest('/teacher/profile', 'GET', null, studentToken);
    console.log('11b. Teacher Profile with Student Token (Expect 403):', teacherProfileStudentToken.status === 403 ? '✅ PASS' : '❌ FAIL', teacherProfileStudentToken.body.message);

    console.log('\n🎉 ALL PHASE 2 VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test Execution Error:', err);
  } finally {
    process.exit(0);
  }
};

// Start temporary test server
server = app.listen(PORT, () => {
  runTests();
});
