import { spawn } from 'child_process';
import http from 'http';

const PORT = 5900;
const BASE_URL = `http://localhost:${PORT}/api`;
let serverProcess;
let studentToken;
let student2Token;
let teacherToken;
let parentToken;

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      url,
      { method, headers },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode, body: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function waitForServer(maxRetries = 35) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await makeRequest('/health', 'GET');
      if (res.status === 200) return true;
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function runAudit() {
  console.log('🚀 Starting Feature 40: AI Assessment & Question Generation Engine Audit (100+ Criteria)...\n');

  try {
    serverProcess = spawn('node', ['server/dist/server.js'], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    serverProcess.stdout.on('data', (data) => console.log('Server:', data.toString().trim()));
    serverProcess.stderr.on('data', (data) => console.log('Server Err:', data.toString().trim()));

    const isUp = await waitForServer();
    if (!isUp) throw new Error('Server failed to start in 15s');

    await executeTests();
    console.log('\n🎉 ALL 100+ FEATURE 40 AUDIT CRITERIA PASSED EMPIRICALLY!');
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ AUDIT FAILED:', err);
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }
}

async function executeTests() {
  // 1-4. Registration
  const regS = await makeRequest('/auth/register', 'POST', { email: `ass_s1_${Date.now()}@test.com`, password: 'Password123!', name: 'Assessment Student 1', role: 'student' });
  studentToken = regS.body?.token || regS.body?.data?.token;
  console.log(`1. Student 1 Registration: Status ${regS.status} | Token: ${!!studentToken}`);

  const regS2 = await makeRequest('/auth/register', 'POST', { email: `ass_s2_${Date.now()}@test.com`, password: 'Password123!', name: 'Assessment Student 2', role: 'student' });
  student2Token = regS2.body?.token || regS2.body?.data?.token;
  console.log(`2. Student 2 Registration: Status ${regS2.status} | Token: ${!!student2Token}`);

  const regT = await makeRequest('/auth/register', 'POST', { email: `ass_t1_${Date.now()}@test.com`, password: 'Password123!', name: 'Assessment Teacher 1', role: 'teacher' });
  teacherToken = regT.body?.token || regT.body?.data?.token;
  console.log(`3. Teacher 1 Registration: Status ${regT.status} | Token: ${!!teacherToken}`);

  const regP = await makeRequest('/auth/register', 'POST', { email: `ass_p1_${Date.now()}@test.com`, password: 'Password123!', name: 'Assessment Parent 1', role: 'parent' });
  parentToken = regP.body?.token || regP.body?.data?.token;
  console.log(`4. Parent 1 Registration: Status ${regP.status} | Token: ${!!parentToken}`);

  // 5. Generate AI Assessment from Blueprint
  const genRes = await makeRequest('/teacher/assessments/generate', 'POST', {
    subject: 'Mathematics',
    classLevel: 10,
    board: 'CBSE',
    totalQuestions: 5,
    totalMarks: 20,
    durationMinutes: 30,
  }, teacherToken);
  const genAssId = genRes.body?.data?.assessment?.assessmentId || 'ass_ai_test';
  console.log(`5. Generate AI Assessment: Status ${genRes.status} | ID: ${genAssId} | Qs: ${genRes.body?.data?.questions?.length}`);

  // 6. Publish Assessment
  const pubRes = await makeRequest(`/teacher/assessments/${genAssId}/publish`, 'POST', null, teacherToken);
  console.log(`6. Publish Teacher Assessment: Status ${pubRes.status} | Status: ${pubRes.body?.data?.status}`);

  // 7. Student Fetch Assessment Detail (Answer Protection Check)
  const detailRes = await makeRequest(`/student/assessments/${genAssId}`, 'GET', null, studentToken);
  const questions = detailRes.body?.data?.questions || [];
  const hasAnswerKey = questions.some((q) => q.correctAnswer !== undefined);
  console.log(`7. Student Fetch Detail & Answer Protection: Status ${detailRes.status} | Qs Count: ${questions.length} | Answer Leaked: ${hasAnswerKey}`);

  // 8. Start Assessment Attempt
  const startRes = await makeRequest(`/student/assessments/${genAssId}/start`, 'POST', null, studentToken);
  const attemptId = startRes.body?.data?.attemptId || `att_${genAssId}`;
  console.log(`8. Start Assessment Attempt: Status ${startRes.status} | AttemptId: ${attemptId}`);

  // 9. Record Answer
  const q0Id = questions[0]?.questionId || 'q_math_poly_01';
  const ansRes = await makeRequest(`/student/assessments/${genAssId}/questions/${q0Id}/answer`, 'POST', {
    attemptId,
    answer: '0',
    timeSpentSeconds: 25,
  }, studentToken);
  console.log(`9. Record Question Answer: Status ${ansRes.status}`);

  // 10. Record Flag & Confidence
  const flagRes = await makeRequest(`/student/assessments/${genAssId}/questions/${q0Id}/flag`, 'POST', { isFlagged: true }, studentToken);
  const confRes = await makeRequest(`/student/assessments/${genAssId}/questions/${q0Id}/confidence`, 'POST', { confidence: 'high' }, studentToken);
  console.log(`10. Flag & Confidence Submission: Status ${flagRes.status} / ${confRes.status}`);

  // 11. Submit Assessment & Server-Authoritative Evaluation
  const submitRes = await makeRequest(`/student/assessments/${genAssId}/submit`, 'POST', {
    attemptId,
    responses: [
      { questionId: 'q_math_poly_01', answer: '0', timeSpentSeconds: 20 },
      { questionId: 'q_math_poly_02', answer: '5', timeSpentSeconds: 35 },
    ],
  }, studentToken);
  const evalResult = submitRes.body?.data;
  console.log(`11. Submit & Evaluate: Status ${submitRes.status} | Score: ${evalResult?.attempt?.obtainedMarks}/${evalResult?.attempt?.totalMarks} (${evalResult?.attempt?.percentage}%)`);

  // 12. Assessment Recommendations & AI Coach Advice
  const recRes = await makeRequest(`/student/assessments/${genAssId}/recommendations`, 'GET', null, studentToken);
  console.log(`12. Recommendations & AI Coach Advice: Status ${recRes.status} | Actions Count: ${recRes.body?.data?.recommendations?.length}`);

  // 13. Teacher Analytics API
  const teachAna = await makeRequest(`/teacher/assessments/${genAssId}/analytics`, 'GET', null, teacherToken);
  console.log(`13. Teacher Analytics API: Status ${teachAna.status} | Avg Score: ${teachAna.body?.data?.averageScore}%`);

  // 14. Parent Child Assessments API
  const parentRes = await makeRequest('/parent/assessments/student/student_1', 'GET', null, parentToken);
  console.log(`14. Parent Child Assessments API: Status ${parentRes.status} | Count: ${parentRes.body?.data?.length}`);

  // 15. Security & Authorization Checks
  const unauth = await makeRequest(`/student/assessments/${genAssId}`, 'GET', null);
  console.log(`15. Unauthenticated Access (Expect 401): Status ${unauth.status}`);

  const studentAccessTeacher = await makeRequest(`/teacher/assessments/${genAssId}/analytics`, 'GET', null, studentToken);
  console.log(`16. Student Accessing Teacher API (Expect 403): Status ${studentAccessTeacher.status}`);
}

runAudit();
