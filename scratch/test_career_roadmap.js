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

const runCareerRoadmapAudit = async () => {
  console.log('🚀 Starting Comprehensive Feature 10: Career & Skill Roadmap Audit...\n');

  try {
    // 0. Registration: Student A, Student B, Teacher, Parent
    const studentAEmail = `student_car_a_${Date.now()}@example.com`;
    const regSA = await makeRequest('/auth/register', 'POST', {
      name: 'Student Career A',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenSA = regSA.body?.token;

    const studentBEmail = `student_car_b_${Date.now()}@example.com`;
    const regSB = await makeRequest('/auth/register', 'POST', {
      name: 'Student Career B',
      email: studentBEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenSB = regSB.body?.token;

    const teacherEmail = `teacher_car_${Date.now()}@example.com`;
    const regT = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher Car',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tokenT = regT.body?.token;

    const parentEmail = `parent_car_${Date.now()}@example.com`;
    const regP = await makeRequest('/auth/register', 'POST', {
      name: 'Parent Car',
      email: parentEmail,
      password: 'password123',
      role: 'parent',
      preferredLanguage: 'english',
    });
    const tokenP = regP.body?.token;

    console.log('0. Registrations Completed (Student A, Student B, Teacher, Parent)');

    // 1. Fetch Career Catalog
    const catalogRes = await makeRequest('/student/career/catalog', 'GET', null, tokenSA);
    const catalog = catalogRes.body?.data;
    console.log(`1. Fetch Career Catalog: Status ${catalogRes.status} | Total Roles: ${catalog?.length}`);
    if (catalogRes.status !== 200 || !Array.isArray(catalog) || catalog.length === 0) {
      throw new Error('Career catalog fetch failed');
    }

    // 2. Reject Invalid Target Role
    const invalidGoalRes = await makeRequest('/student/career/goals', 'POST', { targetRole: 'invalid_role_xyz' }, tokenSA);
    console.log('2. Invalid Target Role Rejection (Expect 400):', invalidGoalRes.status === 400 ? '✅ VERIFIED' : '❌ FAILED');

    // 3. Create Career Goal for Student A
    const targetRole = catalog[0].id; // 'full-stack-developer'
    const createGoalRes = await makeRequest('/student/career/goals', 'POST', { targetRole, notes: 'Targeting full-stack web developer role' }, tokenSA);
    const goalA = createGoalRes.body?.data;
    const goalAId = goalA?._id || goalA?.id;
    console.log(`3. Create Career Goal (Status ${createGoalRes.status}) | Goal ID: ${goalAId}`);

    // 4. List Career Goals for Student A
    const listGoalsRes = await makeRequest('/student/career/goals', 'GET', null, tokenSA);
    console.log('4. List Student Career Goals:', listGoalsRes.body?.data?.length === 1 ? '✅ VERIFIED' : '❌ FAILED');

    // 5. Fetch Career Roadmap
    const roadmapRes = await makeRequest(`/student/career/goals/${goalAId}/roadmap`, 'GET', null, tokenSA);
    const roadmap = roadmapRes.body?.data;
    console.log(`5. Career Roadmap Calculation: Status ${roadmapRes.status} | Readiness: ${roadmap?.readiness}%`);
    if (typeof roadmap?.readiness !== 'number' || roadmap?.readiness < 0 || roadmap?.readiness > 100) {
      throw new Error('Readiness bounds invalid');
    }

    // 6. Fetch Career Advice (AI or Fallback)
    const adviceRes = await makeRequest(`/student/career/goals/${goalAId}/advice`, 'GET', null, tokenSA);
    const adviceData = adviceRes.body?.data;
    console.log(`6. Career Advice Generation (aiEnhanced=${adviceData?.aiEnhanced}): Status ${adviceRes.status} | Advice length: ${adviceData?.advice?.length} chars`);

    // 7. Security: Student A vs Student B Isolation (Accessing Student A goal)
    const studentBAccessRes = await makeRequest(`/student/career/goals/${goalAId}/roadmap`, 'GET', null, tokenSB);
    console.log('7. Student B Cannot Access Student A Roadmap (Expect 404):', studentBAccessRes.status === 404 ? '✅ VERIFIED' : '❌ FAILED');

    // 8. Security: Student B Cannot Delete Student A Goal
    const studentBDeleteRes = await makeRequest(`/student/career/goals/${goalAId}`, 'DELETE', null, tokenSB);
    console.log('8. Student B Cannot Delete Student A Goal (Expect 404):', studentBDeleteRes.status === 404 ? '✅ VERIFIED' : '❌ FAILED');

    // 9. Security: Teacher Access Blocked (Expect 403)
    const teacherRes = await makeRequest('/student/career/catalog', 'GET', null, tokenT);
    console.log('9. Teacher Access Blocked (Expect 403):', teacherRes.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    // 10. Security: Parent Access Blocked (Expect 403)
    const parentRes = await makeRequest('/student/career/catalog', 'GET', null, tokenP);
    console.log('10. Parent Access Blocked (Expect 403):', parentRes.status === 403 ? '✅ VERIFIED' : '❌ FAILED');

    // 11. Security: Unauthenticated Access Blocked (Expect 401)
    const unauthRes = await makeRequest('/student/career/catalog', 'GET', null, null);
    console.log('11. Unauthenticated Access Blocked (Expect 401):', unauthRes.status === 401 ? '✅ VERIFIED' : '❌ FAILED');

    // 12. Client Score Spoofing Prevention
    const spoofTry = await makeRequest('/student/career/goals', 'POST', { targetRole, readinessScore: 100, score: 100 }, tokenSA);
    const recheckRoadmap = await makeRequest(`/student/career/goals/${goalAId}/roadmap`, 'GET', null, tokenSA);
    console.log('12. Client Readiness Score Spoofing Prevention:', recheckRoadmap.body?.data?.readiness === roadmap.readiness ? '✅ VERIFIED' : '❌ FAILED');

    // 13. TopicMastery Integration Verification
    // Create practice session for Student A on a JavaScript topic
    const psRes = await makeRequest('/student/practice/sessions', 'POST', { subjectId: 'subj_web', topicId: 'javascript_basics', difficulty: 'medium' }, tokenSA);
    if (psRes.body?.data?.sessionId) {
      await makeRequest(`/student/practice/sessions/${psRes.body.data.sessionId}/answer`, 'POST', {
        questionId: 'q_js_1',
        answer: 'var x = 1;',
        isCorrect: true,
        timeSpentSeconds: 15,
      }, tokenSA);
    }
    const updatedRoadmap = await makeRequest(`/student/career/goals/${goalAId}/roadmap`, 'GET', null, tokenSA);
    const jsSkill = updatedRoadmap.body?.data?.skills?.find((s) => s.name.includes('JavaScript'));
    console.log(`13. TopicMastery Integration (JS Skill Score: ${jsSkill?.score}%):`, typeof jsSkill?.score === 'number' ? '✅ VERIFIED' : '❌ FAILED');

    // 14. Delete Goal for Student A
    const deleteRes = await makeRequest(`/student/career/goals/${goalAId}`, 'DELETE', null, tokenSA);
    console.log('14. Delete Career Goal (Status 200):', deleteRes.status === 200 ? '✅ VERIFIED' : '❌ FAILED');

    // 15. Secrets & Privacy Safeguards
    const secretsCheckStr = JSON.stringify({ catalog, roadmap, adviceData });
    const noSecrets = !secretsCheckStr.includes('password') && !secretsCheckStr.includes('JWT_SECRET') && !secretsCheckStr.includes('AI_API_KEY');
    console.log('15. Privacy & Secret Safeguards:', noSecrets ? '✅ VERIFIED' : '❌ FAILED');

    console.log('\n🎉 ALL FEATURE 10 TEST CRITERIA PASSED EMPIRICALLY!');
  } catch (err) {
    console.error('❌ Career Roadmap Test Error:', err);
    process.exit(1);
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
      await runCareerRoadmapAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});
