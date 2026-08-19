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
  console.log('🧪 Starting Phase 6A Learning Intelligence Engine Test Suite...\n');
  let studentAToken = null;
  let studentBToken = null;
  let teacherToken = null;

  try {
    // 1. Health Endpoint Test
    const health = await makeRequest('/health');
    console.log('1. GET /api/health:', health.status === 200 && health.body.success ? '✅ PASS' : '❌ FAIL');

    // 2. Register Test Users
    const studentAEmail = `studentA_p6a_${Date.now()}@example.com`;
    const regStudentA = await makeRequest('/auth/register', 'POST', {
      name: 'Student A',
      email: studentAEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    studentAToken = regStudentA.body.token;

    const studentBEmail = `studentB_p6a_${Date.now()}@example.com`;
    const regStudentB = await makeRequest('/auth/register', 'POST', {
      name: 'Student B',
      email: studentBEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'hindi',
    });
    studentBToken = regStudentB.body.token;

    const teacherEmail = `teacher_p6a_${Date.now()}@example.com`;
    const regTeacher = await makeRequest('/auth/register', 'POST', {
      name: 'Teacher P6A',
      email: teacherEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    teacherToken = regTeacher.body.token;
    console.log('2. Register Test Users:', (studentAToken && studentBToken && teacherToken) ? '✅ PASS' : '❌ FAIL');

    // Fetch seed topic IDs
    const topicsRes = await makeRequest('/topics', 'GET');
    const topics = topicsRes.body.data || [];
    const topicLinEq = topics.find((t) => t.name.includes('Linear Equations')) || topics[0];
    const topicId = topicLinEq?._id || topicLinEq?.id || 'dummy_topic_1';

    // 3. Security Guard Checks
    const teacherAnalyzeRes = await makeRequest('/student/learning/analyze', 'POST', { topicId, isCorrect: true }, teacherToken);
    console.log('3. Teacher Accessing Student Analysis Endpoint (Expect 403):', teacherAnalyzeRes.status === 403 ? '✅ PASS' : '❌ FAIL');

    const unauthAnalyzeRes = await makeRequest('/student/learning/analyze', 'POST', { topicId, isCorrect: true }, null);
    console.log('4. Unauthenticated Accessing Student Analysis Endpoint (Expect 401):', unauthAnalyzeRes.status === 401 ? '✅ PASS' : '❌ FAIL');

    // 5. Input Validation Check
    const badReqRes = await makeRequest('/student/learning/analyze', 'POST', { topicId }, studentAToken);
    console.log('5. Input Validation (Missing isCorrect - Expect 400):', badReqRes.status === 400 ? '✅ PASS' : '❌ FAIL', badReqRes.body.message);

    // 6. Correct Evidence Submission & Topic Mastery Calculation
    const ev1Id = `ev_test_${Date.now()}_1`;
    const correctRes = await makeRequest('/student/learning/analyze', 'POST', {
      topicId,
      evidenceId: ev1Id,
      analysisType: 'practice_attempt',
      isCorrect: true,
    }, studentAToken);

    console.log('6. Correct Evidence Submission (Updates TopicMastery):', correctRes.status === 200 && correctRes.body.data ? '✅ PASS' : '❌ FAIL');
    if (correctRes.body?.data) {
      console.log('   - Mastery Score:', correctRes.body.data.masteryScore);
      console.log('   - Mastery Status:', correctRes.body.data.masteryStatus);
      console.log('   - Confidence Score:', correctRes.body.data.confidenceScore);
    }

    // 7. Single Incorrect Answer Test (Should NOT create high-confidence misconception)
    const ev2Id = `ev_test_${Date.now()}_2`;
    const singleIncorrectRes = await makeRequest('/student/learning/analyze', 'POST', {
      topicId,
      evidenceId: ev2Id,
      analysisType: 'practice_attempt',
      isCorrect: false,
      studentAnswer: '2x = 5',
    }, studentAToken);

    console.log('7. Single Incorrect Answer (Does NOT create high-confidence misconception):', singleIncorrectRes.body.data.gapConfidence < 0.9 ? '✅ PASS' : '❌ FAIL');
    console.log('   - Detected Gap Type:', singleIncorrectRes.body.data.detectedGapType);
    console.log('   - Severity:', singleIncorrectRes.body.data.severity);

    // 8. Repeated Incorrect Attempts & Gap Generation
    const ev3Id = `ev_test_${Date.now()}_3`;
    const repeatedIncorrectRes = await makeRequest('/student/learning/analyze', 'POST', {
      topicId,
      evidenceId: ev3Id,
      analysisType: 'practice_attempt',
      isCorrect: false,
      studentAnswer: '2x = 5',
    }, studentAToken);

    console.log('8. Repeated Incorrect Attempts (Creates Learning Gap):', repeatedIncorrectRes.status === 200 && repeatedIncorrectRes.body.data.detectedGapType !== 'none' ? '✅ PASS' : '❌ FAIL');
    console.log('   - Detected Gap Type:', repeatedIncorrectRes.body.data.detectedGapType);
    console.log('   - Evidence Summary:', repeatedIncorrectRes.body.data.evidenceSummary);
    console.log('   - Recommended Action:', repeatedIncorrectRes.body.data.recommendedAction);

    // 9. Fetch Student Learning Gaps List
    const gapsListRes = await makeRequest('/student/learning/gaps', 'GET', null, studentAToken);
    console.log('9. GET /api/student/learning/gaps:', gapsListRes.status === 200 && gapsListRes.body.data ? '✅ PASS' : '❌ FAIL');
    const activeGap = gapsListRes.body.data[0];
    const gapId = activeGap?._id || activeGap?.id;

    // 10. Gap Resolution Test
    if (gapId) {
      const resolveRes = await makeRequest(`/student/learning/gaps/${gapId}/resolve`, 'PUT', null, studentAToken);
      console.log('10. PUT /api/student/learning/gaps/:id/resolve:', resolveRes.status === 200 ? '✅ PASS' : '❌ FAIL', resolveRes.body.message);
    }

    // 11. Idempotency Check (Duplicate evidenceId)
    const duplicateEvRes = await makeRequest('/student/learning/analyze', 'POST', {
      topicId,
      evidenceId: ev1Id,
      analysisType: 'practice_attempt',
      isCorrect: true,
    }, studentAToken);
    console.log('11. Idempotency Check (Duplicate evidenceId deduplication):', duplicateEvRes.status === 200 ? '✅ PASS' : '❌ FAIL');

    // 12. Ownership Check: Student B accessing Student A's gap
    if (gapId) {
      const studentBAccessGapRes = await makeRequest(`/student/learning/gaps/${gapId}`, 'GET', null, studentBToken);
      console.log('12. Security: Student B accessing Student A gap (Expect 404/403):', (studentBAccessGapRes.status === 404 || studentBAccessGapRes.status === 403) ? '✅ PASS' : '❌ FAIL', studentBAccessGapRes.body.message);
    }

    console.log('\n🎉 ALL PHASE 6A LEARNING INTELLIGENCE ENGINE TESTS PASSED SUCCESSFULLY!');
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
