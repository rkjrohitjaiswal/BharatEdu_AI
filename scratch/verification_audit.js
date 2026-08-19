import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

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

const runAudit = async () => {
  console.log('=============== BHARATEDU AI VERIFICATION AUDIT (PHASES 1–5C) ===============\n');

  let studentAToken = null;
  let studentBToken = null;
  let teacherToken = null;

  try {
    // 1. Health Endpoint Test
    console.log('--- 1. HEALTH ENDPOINT AUDIT ---');
    const health = await makeRequest('/health');
    console.log('GET /api/health Status:', health.status);
    console.log('Response Payload:', health.body);
    const healthPass = health.status === 200 && health.body.success && health.body.message === 'BharatEdu AI API is running';
    console.log('Result:', healthPass ? '✅ PASS' : '❌ FAIL');
    console.log('');

    // 2. Authentication & Security Audit
    console.log('--- 2. AUTHENTICATION & SECURITY AUDIT ---');
    const studentAEmail = `audit_studentA_${Date.now()}@example.com`;
    const regStudentA = await makeRequest('/auth/register', 'POST', {
      name: 'Audit Student A',
      email: studentAEmail,
      password: 'SecurePassword123',
      role: 'student',
      preferredLanguage: 'english',
    });
    studentAToken = regStudentA.body.token;

    const dupStudentA = await makeRequest('/auth/register', 'POST', {
      name: 'Duplicate Student',
      email: studentAEmail,
      password: 'SecurePassword123',
      role: 'student',
      preferredLanguage: 'english',
    });

    const studentBEmail = `audit_studentB_${Date.now()}@example.com`;
    const regStudentB = await makeRequest('/auth/register', 'POST', {
      name: 'Audit Student B',
      email: studentBEmail,
      password: 'SecurePassword123',
      role: 'student',
      preferredLanguage: 'hindi',
    });
    studentBToken = regStudentB.body.token;

    const teacherEmail = `audit_teacher_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Audit Teacher Anita',
      email: teacherEmail,
      password: 'SecurePassword123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    teacherToken = regTeacher.body.token;

    const loginRes = await makeRequest('/auth/login', 'POST', {
      email: studentAEmail,
      password: 'SecurePassword123',
    });

    const badPassRes = await makeRequest('/auth/login', 'POST', {
      email: studentAEmail,
      password: 'WrongPassword',
    });

    const meRes = await makeRequest('/auth/me', 'GET', null, studentAToken);

    console.log('Registration Student A:', regStudentA.status === 201 ? '✅ PASS' : '❌ FAIL');
    console.log('Duplicate Email Rejection:', dupStudentA.status === 400 ? '✅ PASS' : '❌ FAIL', dupStudentA.body.message);
    console.log('Login Student A:', loginRes.status === 200 ? '✅ PASS' : '❌ FAIL');
    console.log('Wrong Password Rejection:', badPassRes.status === 401 ? '✅ PASS' : '❌ FAIL', badPassRes.body.message);
    console.log('PasswordHash Excluded from User Object:', meRes.body.user && !meRes.body.user.passwordHash ? '✅ PASS' : '❌ FAIL');
    console.log('');

    // 3. Role Security Audit
    console.log('--- 3. ROLE SECURITY AUDIT ---');
    const stdAccessStudentDash = await makeRequest('/student/dashboard', 'GET', null, studentAToken);
    const stdAccessTeacherClasses = await makeRequest('/teacher/classes', 'GET', null, studentAToken);
    const teacherAccessTeacherClasses = await makeRequest('/teacher/classes', 'GET', null, teacherToken);
    const teacherAccessStudentDash = await makeRequest('/student/dashboard', 'GET', null, teacherToken);
    const unauthAccessDash = await makeRequest('/student/dashboard', 'GET', null, null);

    console.log('Student -> Student Endpoint (/student/dashboard):', stdAccessStudentDash.status === 200 ? '✅ PASS (200 OK)' : '❌ FAIL');
    console.log('Student -> Teacher Endpoint (/teacher/classes):', stdAccessTeacherClasses.status === 403 ? '✅ PASS (403 Forbidden)' : '❌ FAIL');
    console.log('Teacher -> Teacher Endpoint (/teacher/classes):', teacherAccessTeacherClasses.status === 200 ? '✅ PASS (200 OK)' : '❌ FAIL');
    console.log('Teacher -> Student Endpoint (/student/dashboard):', teacherAccessStudentDash.status === 403 ? '✅ PASS (403 Forbidden)' : '❌ FAIL');
    console.log('Unauthenticated -> Protected Endpoint:', unauthAccessDash.status === 401 ? '✅ PASS (401 Unauthorized)' : '❌ FAIL');
    console.log('');

    // 4. Student Dashboard Audit
    console.log('--- 4. STUDENT DASHBOARD DATA AUDIT ---');
    const dashData = stdAccessStudentDash.body.data;
    console.log('Student Profile Class Level:', dashData.studentProfile.classLevel);
    console.log('Student Profile Education Board:', dashData.studentProfile.educationBoard);
    console.log('Subject Performance Items:', dashData.subjectPerformance.length);
    console.log('Active Learning Gaps:', dashData.learningGaps.length);
    console.log('Scholarship Matches Preview:', dashData.scholarshipMatches.length);
    console.log('');

    // 5. Tutor Security & Ownership Audit
    console.log('--- 5. TUTOR SECURITY & CONVERSATION OWNERSHIP AUDIT ---');
    const createConvA = await makeRequest('/tutor/conversations', 'POST', {
      title: 'Audit Doubt Math',
      language: 'english',
    }, studentAToken);
    const convAId = createConvA.body.data._id || createConvA.body.data.id;

    const studentBReadConvA = await makeRequest(`/tutor/conversations/${convAId}`, 'GET', null, studentBToken);
    const teacherReadConvA = await makeRequest(`/tutor/conversations/${convAId}`, 'GET', null, teacherToken);
    const unauthReadConvA = await makeRequest(`/tutor/conversations/${convAId}`, 'GET', null, null);

    console.log('Student A Created Conversation:', createConvA.status === 201 ? '✅ PASS' : '❌ FAIL');
    console.log('Student B Accessing Student A Conversation (Expect 404/403):', (studentBReadConvA.status === 404 || studentBReadConvA.status === 403) ? '✅ PASS' : '❌ FAIL', studentBReadConvA.body.message);
    console.log('Teacher Accessing Student Tutor Endpoint (Expect 403):', teacherReadConvA.status === 403 ? '✅ PASS' : '❌ FAIL');
    console.log('Unauthenticated Accessing Tutor Endpoint (Expect 401):', unauthReadConvA.status === 401 ? '✅ PASS' : '❌ FAIL');
    console.log('');

    // 6. RAG Grounded Doubt Solving & Citations Audit
    console.log('--- 6. RAG GROUNDED DOUBT SOLVING & CITATIONS AUDIT ---');
    
    // Query 1: Matched RAG Question
    const msgRes1 = await makeRequest(`/tutor/conversations/${convAId}/messages`, 'POST', {
      content: 'How do you solve linear equations by transposition?',
    }, studentAToken);

    console.log('Query 1 (Linear Equations Transposition):');
    console.log('  Status:', msgRes1.status);
    console.log('  Tutor Message Content:', msgRes1.body?.data?.tutorMessage?.content?.substring(0, 120) + '...');
    console.log('  Sources Count:', msgRes1.body?.data?.tutorMessage?.sources?.length);
    if (msgRes1.body?.data?.tutorMessage?.sources?.length > 0) {
      console.log('  Source 1 Title:', msgRes1.body.data.tutorMessage.sources[0].title);
      console.log('  Source 1 Publisher:', msgRes1.body.data.tutorMessage.sources[0].publisher);
    }

    // Query 2: Unmatched / Irrelevant Question (No Fake Citations Test)
    const msgRes2 = await makeRequest(`/tutor/conversations/${convAId}/messages`, 'POST', {
      content: 'What is the exact population of Paris in 2026?',
    }, studentAToken);

    console.log('\nQuery 2 (Irrelevant Question - No Fake Citations Test):');
    console.log('  Status:', msgRes2.status);
    console.log('  Sources Count (Expect 0):', msgRes2.body?.data?.tutorMessage?.sources?.length);
    console.log('  No Fake Citations Verified:', msgRes2.body?.data?.tutorMessage?.sources?.length === 0 ? '✅ PASS' : '❌ FAIL');
    console.log('');

    // 7. Input Validation & Error Handling Audit
    console.log('--- 7. INPUT VALIDATION & ERROR HANDLING AUDIT ---');
    const emptyMsgRes = await makeRequest(`/tutor/conversations/${convAId}/messages`, 'POST', { content: '' }, studentAToken);
    const longMsgRes = await makeRequest(`/tutor/conversations/${convAId}/messages`, 'POST', { content: 'a'.repeat(1001) }, studentAToken);

    console.log('Empty Message Rejection (400):', emptyMsgRes.status === 400 ? '✅ PASS' : '❌ FAIL', emptyMsgRes.body.message);
    console.log('Overlong Message Rejection (400):', longMsgRes.status === 400 ? '✅ PASS' : '❌ FAIL', longMsgRes.body.message);
    console.log('');

    console.log('================ AUDIT API EXECUTION COMPLETE ================\n');
  } catch (err) {
    console.error('❌ Audit Execution Error:', err);
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
      await runAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
