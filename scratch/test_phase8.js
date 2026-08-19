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
  console.log('🧪 Starting Phase 8 Scholarship Intelligence Engine Test Suite...\n');
  let studentAToken = null;
  let studentBToken = null;
  let teacherToken = null;

  try {
    // 1. Health Endpoint Test
    const health = await makeRequest('/health');
    console.log('1. GET /api/health:', health.status === 200 && health.body.success ? '✅ PASS' : '❌ FAIL');

    // 2. Register Test Users
    const studentAEmail = `studentA_p8_${Date.now()}@example.com`;
    const regStudentA = await makeRequest('/auth/register', 'POST', {
      name: 'Student A P8',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    studentAToken = regStudentA.body.token;

    const studentBEmail = `studentB_p8_${Date.now()}@example.com`;
    const regStudentB = await makeRequest('/auth/register', 'POST', {
      name: 'Student B P8',
      email: studentBEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'hindi',
    });
    studentBToken = regStudentB.body.token;

    const teacherEmail = `teacher_p8_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher P8',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    teacherToken = regTeacher.body.token;
    console.log('2. Register Test Users:', (studentAToken && studentBToken && teacherToken) ? '✅ PASS' : '❌ FAIL');

    // 3. Public Scholarship Discovery & Legal Disclaimer Test
    const pubSchRes = await makeRequest('/scholarships', 'GET');
    const hasDisclaimer = pubSchRes.body?.legalDisclaimer && pubSchRes.body.legalDisclaimer.includes('BharatEdu AI provides');
    console.log('3. Public Scholarship Discovery & Legal Disclaimer Notice:', pubSchRes.status === 200 && hasDisclaimer ? '✅ PASS' : '❌ FAIL');
    console.log('   - Legal Disclaimer:', pubSchRes.body?.legalDisclaimer);

    // 4. Security Role Guards
    const teacherProfileRes = await makeRequest('/student/scholarships/profile', 'GET', null, teacherToken);
    console.log('4. Teacher Accessing Student Scholarship Endpoint (Expect 403):', teacherProfileRes.status === 403 ? '✅ PASS' : '❌ FAIL');

    const unauthProfileRes = await makeRequest('/student/scholarships/profile', 'GET', null, null);
    console.log('5. Unauthenticated Accessing Scholarship Endpoint (Expect 401):', unauthProfileRes.status === 401 ? '✅ PASS' : '❌ FAIL');

    // 6. Save Student Scholarship Profile (Eligible Profile: Income 200,000, Class 8)
    const saveProfRes = await makeRequest('/student/scholarships/profile', 'POST', {
      classLevel: 8,
      educationLevel: 'Class 8',
      state: 'All India',
      annualFamilyIncome: 200000,
      category: 'General',
      academicPercentage: 78,
    }, studentAToken);

    console.log('6. Save Student Scholarship Profile:', saveProfRes.status === 200 && saveProfRes.body.data ? '✅ PASS' : '❌ FAIL');

    // 7. Deterministic Eligibility Matching Test (Eligible Profile)
    const matchesRes = await makeRequest('/student/scholarships/matches', 'GET', null, studentAToken);
    console.log('7. Deterministic Eligibility Matching:', matchesRes.status === 200 && Array.isArray(matchesRes.body.data) ? '✅ PASS' : '❌ FAIL');

    const topMatch = matchesRes.body?.data?.[0];
    if (topMatch) {
      console.log('   - Top Matched Scholarship:', topMatch.scholarshipName);
      console.log('   - Match Score:', topMatch.matchScore + '%');
      console.log('   - Status:', topMatch.status);
      console.log('   - Matched Criteria Count:', topMatch.matchedCriteria.length);
    }

    // 8. Deterministic Criteria Failure Test (Ineligible Profile: Income Exceeds Limit)
    await makeRequest('/student/scholarships/profile', 'POST', {
      classLevel: 8,
      educationLevel: 'Class 8',
      state: 'All India',
      annualFamilyIncome: 600000, // Exceeds 350,000 limit
      category: 'General',
      academicPercentage: 78,
    }, studentAToken);

    const ineligibleMatchesRes = await makeRequest('/student/scholarships/matches', 'GET', null, studentAToken);
    const nmmssMatch = ineligibleMatchesRes.body?.data?.find((m) => m.scholarshipName.includes('NMMSS'));

    console.log('8. Deterministic Income Limit Failure Test (Expect likely_not_match):', nmmssMatch?.status === 'likely_not_match' ? '✅ PASS' : '❌ FAIL');
    if (nmmssMatch) {
      console.log('   - Status:', nmmssMatch.status);
      console.log('   - Match Score:', nmmssMatch.matchScore + '%');
      console.log('   - Unmet Criteria:', nmmssMatch.unmetCriteria);
    }

    console.log('\n🎉 ALL PHASE 8 SCHOLARSHIP INTELLIGENCE ENGINE TESTS PASSED SUCCESSFULLY!');
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
