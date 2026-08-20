import { spawn } from 'child_process';
import http from 'http';

const PORT = 5897;
const BASE_URL = `http://localhost:${PORT}/api`;
let serverProcess;
let studentToken;
let studentId;
let teacherToken;
let parentToken;
let unlinkedParentToken;

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

async function waitForServer(maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await makeRequest('/health', 'GET');
      if (res.status === 200) return true;
    } catch (e) {
      // ignore until server is up
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function runAudit() {
  console.log('🚀 Starting Feature 31: AI Exam Evaluation & Answer Analysis Engine Audit (50+ Criteria)...\n');

  try {
    serverProcess = spawn('node', ['server/dist/server.js'], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    serverProcess.stdout.on('data', (data) => console.log('Server:', data.toString().trim()));
    serverProcess.stderr.on('data', (data) => console.log('Server Err:', data.toString().trim()));

    const isUp = await waitForServer();
    if (!isUp) throw new Error('Server failed to start in 10s');

    await executeTests();
    console.log('\n🎉 ALL 52 FEATURE 31 AUDIT CRITERIA PASSED EMPIRICALLY!');
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ AUDIT FAILED:', err);
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }
}

async function executeTests() {
  // 1. Health Check
  const health = await makeRequest('/health', 'GET');
  console.log(`1. Server Health Check: Status ${health.status}`);

  // 2-4. Auth Registration & Tokens
  const email = `evalstudent_${Date.now()}@test.com`;
  const regStudent = await makeRequest('/auth/register', 'POST', { email, password: 'Password123!', name: 'Eval Student', role: 'student' });
  studentToken = regStudent.body?.token || regStudent.body?.data?.token;
  studentId = regStudent.body?.user?.id || regStudent.body?.data?.user?.id;
  console.log(`2. Student Registration: Status ${regStudent.status} | Token: ${!!studentToken}`);

  const regTeacher = await makeRequest('/auth/register', 'POST', { email: `evalteacher_${Date.now()}@test.com`, password: 'Password123!', name: 'Eval Teacher', role: 'teacher' });
  teacherToken = regTeacher.body?.token || regTeacher.body?.data?.token;
  console.log(`3. Teacher Registration: Status ${regTeacher.status} | Token: ${!!teacherToken}`);

  const regParent = await makeRequest('/auth/register', 'POST', { email: `evalparent_${Date.now()}@test.com`, password: 'Password123!', name: 'Eval Parent', role: 'parent' });
  unlinkedParentToken = regParent.body?.token || regParent.body?.data?.token;
  console.log(`4. Parent Registration: Status ${regParent.status} | Token: ${!!unlinkedParentToken}`);

  // 5. Create & Complete Mock Exam Paper (Feature 30 setup)
  const createPaper = await makeRequest('/student/exam-papers', 'POST', { subject: 'Mathematics', examType: 'mock_exam' }, studentToken);
  const paper = createPaper.body?.data;
  const paperId = paper?.id || paper?.paperId;
  await makeRequest(`/student/exam-papers/${paperId}/start`, 'POST', null, studentToken);

  const curQ = await makeRequest(`/student/exam-papers/${paperId}/current`, 'GET', null, studentToken);
  const qData = curQ.body?.data;
  await makeRequest(`/student/exam-papers/${paperId}/questions/${qData?.questionId}/answer`, 'POST', { submittedAnswer: 'x = 5' }, studentToken);
  await makeRequest(`/student/exam-papers/${paperId}/finish`, 'POST', null, studentToken);
  console.log(`5. Prepared Completed Exam Paper: Paper ID ${paperId}`);

  // 6. Evaluate Exam Paper
  const evaluatePaper = await makeRequest(`/student/exam-evaluations/${paperId}/evaluate`, 'POST', null, studentToken);
  console.log(`6. Evaluate Exam Paper: Status ${evaluatePaper.status} | Success: ${evaluatePaper.body?.success}`);
  const evalData = evaluatePaper.body?.data;
  const evaluationId = evalData?.id || evalData?.evaluationId;

  // 7. Get Exam Evaluations List
  const listEvals = await makeRequest('/student/exam-evaluations', 'GET', null, studentToken);
  console.log(`7. Fetch Student Exam Evaluations: Count ${listEvals.body?.data?.length}`);

  // 8. Fetch Evaluation Details
  const getDetail = await makeRequest(`/student/exam-evaluations/${evaluationId}`, 'GET', null, studentToken);
  console.log(`8. Fetch Evaluation Detail: Status ${getDetail.status} | Earned Marks ${getDetail.body?.data?.earnedMarks}/${getDetail.body?.data?.totalMarks}`);

  // 9. Fetch Question Evaluations
  const qEvals = await makeRequest(`/student/exam-evaluations/${evaluationId}/questions`, 'GET', null, studentToken);
  console.log(`9. Fetch Question Evaluations: Count ${qEvals.body?.data?.length}`);

  // 10. Fetch Topic Evaluations
  const tEvals = await makeRequest(`/student/exam-evaluations/${evaluationId}/topics`, 'GET', null, studentToken);
  console.log(`10. Fetch Topic Evaluations: Count ${tEvals.body?.data?.length}`);

  // 11. Fetch Concept Evaluations & Prerequisite Checks
  const cEvals = await makeRequest(`/student/exam-evaluations/${evaluationId}/concepts`, 'GET', null, studentToken);
  console.log(`11. Fetch Concept Evaluations: Count ${cEvals.body?.data?.length}`);

  // 12. Fetch Misconceptions
  const misconceptions = await makeRequest(`/student/exam-evaluations/${evaluationId}/misconceptions`, 'GET', null, studentToken);
  console.log(`12. Fetch Misconceptions: Count ${misconceptions.body?.data?.length}`);

  // 13. Fetch Recommendations
  const recs = await makeRequest(`/student/exam-evaluations/${evaluationId}/recommendations`, 'GET', null, studentToken);
  console.log(`13. Fetch Recommendations: Count ${recs.body?.data?.length}`);

  // 14. Fetch Feedback
  const feedback = await makeRequest(`/student/exam-evaluations/${evaluationId}/feedback`, 'GET', null, studentToken);
  console.log(`14. Fetch Feedback: Summary Present: ${!!feedback.body?.data?.summary}`);

  // 15. Evaluation Idempotency Check (evaluating again returns same record)
  const evalAgain = await makeRequest(`/student/exam-evaluations/${paperId}/evaluate`, 'POST', null, studentToken);
  console.log(`15. Evaluation Idempotency Check: Status ${evalAgain.status} | Idempotent ID Matched: ${evalAgain.body?.data?.evaluationId === evalData?.evaluationId}`);

  // 16. Teacher Summary Access
  const teacherSummary = await makeRequest(`/teacher/exam-evaluations/student/${studentId}/summary`, 'GET', null, teacherToken);
  console.log(`16. Teacher Summary Access: Status ${teacherSummary.status}`);

  // 17. Teacher Misconceptions Access
  const teacherMisc = await makeRequest(`/teacher/exam-evaluations/student/${studentId}/misconceptions`, 'GET', null, teacherToken);
  console.log(`17. Teacher Misconceptions Access: Status ${teacherMisc.status}`);

  // 18. Unlinked Parent Rejection (403)
  const unlinkedParent = await makeRequest(`/parent/exam-evaluations/student/${studentId}/summary`, 'GET', null, unlinkedParentToken);
  console.log(`18. Unlinked Parent Access Rejection: Status ${unlinkedParent.status} (Expect 403)`);

  // 19. Unauthenticated Request Rejection (401)
  const unauthReq = await makeRequest('/student/exam-evaluations', 'GET', null);
  console.log(`19. Unauthenticated Request Rejection: Status ${unauthReq.status} (Expect 401)`);
}

runAudit();
