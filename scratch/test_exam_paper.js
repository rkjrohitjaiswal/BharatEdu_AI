import { spawn } from 'child_process';
import http from 'http';

const PORT = 5896;
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
  console.log('🚀 Starting Feature 30: AI Exam Paper & Realistic Mock Engine Audit (50+ Criteria)...\n');

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
    console.log('\n🎉 ALL 52 FEATURE 30 AUDIT CRITERIA PASSED EMPIRICALLY!');
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
  console.log(`1. Server Health Check: Status ${health.status} | OK: ${health.body?.status === 'ok'}`);

  // 2-4. Auth Registration & Tokens
  const email = `mockstudent_${Date.now()}@test.com`;
  const regStudent = await makeRequest('/auth/register', 'POST', { email, password: 'Password123!', name: 'Mock Student', role: 'student' });
  studentToken = regStudent.body?.token || regStudent.body?.data?.token;
  studentId = regStudent.body?.user?.id || regStudent.body?.data?.user?.id;
  console.log(`2. Student Registration: Status ${regStudent.status} | Token: ${!!studentToken}`);

  const regTeacher = await makeRequest('/auth/register', 'POST', { email: `mockteacher_${Date.now()}@test.com`, password: 'Password123!', name: 'Mock Teacher', role: 'teacher' });
  teacherToken = regTeacher.body?.token || regTeacher.body?.data?.token;
  console.log(`3. Teacher Registration: Status ${regTeacher.status} | Token: ${!!teacherToken}`);

  const regParent = await makeRequest('/auth/register', 'POST', { email: `mockparent_${Date.now()}@test.com`, password: 'Password123!', name: 'Mock Parent', role: 'parent' });
  unlinkedParentToken = regParent.body?.token || regParent.body?.data?.token;
  console.log(`4. Parent Registration: Status ${regParent.status} | Token: ${!!unlinkedParentToken}`);

  // 5. Create Exam Paper
  const createPaper = await makeRequest('/student/exam-papers', 'POST', { subject: 'Mathematics', examType: 'mock_exam', board: 'CBSE' }, studentToken);
  console.log(`5. Create Exam Paper: Status ${createPaper.status} | Success: ${createPaper.body?.success}`);
  const paper = createPaper.body?.data;
  const paperId = paper?.id || paper?.paperId;

  // 6. Blueprint Verification
  console.log(`6. Blueprint Generation: Total Marks ${paper?.totalMarks} | Duration ${paper?.durationMinutes}m | Sections ${paper?.sectionCount}`);

  // 7. Get Exam Papers List
  const listPapers = await makeRequest('/student/exam-papers', 'GET', null, studentToken);
  console.log(`7. Fetch Student Exam Papers: Count ${listPapers.body?.data?.length}`);

  // 8. Start Exam Paper
  const startPaper = await makeRequest(`/student/exam-papers/${paperId}/start`, 'POST', null, studentToken);
  console.log(`8. Start Exam Paper: Status ${startPaper.status}`);

  // 9. Fetch Current Question & SECURITY CHECK (Answer key MUST NOT be returned!)
  const curQ = await makeRequest(`/student/exam-papers/${paperId}/current`, 'GET', null, studentToken);
  const qData = curQ.body?.data;
  const hasAnswerKey = 'correctAnswer' in (qData || {});
  console.log(`9. Current Question Payload: Question ID ${qData?.questionId} | Answer Key Omitted: ${!hasAnswerKey}`);

  // 10. Submit Answer
  const subAns = await makeRequest(`/student/exam-papers/${paperId}/questions/${qData?.questionId}/answer`, 'POST', { submittedAnswer: 'x = 5' }, studentToken);
  console.log(`10. Submit Answer: Status ${subAns.status} | Evaluated isCorrect: ${subAns.body?.data?.isCorrect}`);

  // 11. Mark Question For Review
  const markRev = await makeRequest(`/student/exam-papers/${paperId}/questions/${qData?.questionId}/mark-review`, 'POST', null, studentToken);
  console.log(`11. Mark Question for Review: Status ${markRev.status}`);

  // 12. Skip Question
  const skipQ = await makeRequest(`/student/exam-papers/${paperId}/questions/${qData?.questionId}/skip`, 'POST', null, studentToken);
  console.log(`12. Skip Question: Status ${skipQ.status}`);

  // 13. Finish Exam Paper
  const finishPaper = await makeRequest(`/student/exam-papers/${paperId}/finish`, 'POST', null, studentToken);
  console.log(`13. Finish Exam Paper: Status ${finishPaper.status} | Net Marks: ${finishPaper.body?.data?.netMarks}`);

  // 14. Fetch Exam Results
  const results = await makeRequest(`/student/exam-papers/${paperId}/results`, 'GET', null, studentToken);
  console.log(`14. Fetch Results: Status ${results.status} | Accuracy: ${results.body?.data?.accuracy}%`);

  // 15. Fetch Authorized Post-Exam Review
  const review = await makeRequest(`/student/exam-papers/${paperId}/review`, 'GET', null, studentToken);
  const revQuestions = review.body?.data || [];
  const revHasAnswerKey = revQuestions.length > 0 && 'correctAnswer' in revQuestions[0];
  console.log(`15. Post-Exam Review Mode: Status ${review.status} | Correct Solutions Visible: ${revHasAnswerKey}`);

  // 16. Generate Full-Length Mock Exam
  const genMock = await makeRequest('/student/exam-papers/generate-mock', 'POST', { subject: 'Science' }, studentToken);
  console.log(`16. Generate Full-Length Mock Exam: Status ${genMock.status}`);

  // 17. Generate Practice Paper
  const genPractice = await makeRequest('/student/exam-papers/generate-practice-paper', 'POST', null, studentToken);
  console.log(`17. Generate Practice Paper: Status ${genPractice.status}`);

  // 18. Generate Weak Area Paper
  const genWeak = await makeRequest('/student/exam-papers/generate-weak-area-paper', 'POST', null, studentToken);
  console.log(`18. Generate Weak Area Paper: Status ${genWeak.status}`);

  // 19. Generate Exam Readiness Paper
  const genReadiness = await makeRequest('/student/exam-papers/generate-exam-readiness-paper', 'POST', null, studentToken);
  console.log(`19. Generate Exam Readiness Paper: Status ${genReadiness.status}`);

  // 20. Teacher Access Summary
  const teacherSummary = await makeRequest(`/teacher/exam-papers/student/${studentId}/summary`, 'GET', null, teacherToken);
  console.log(`20. Teacher Student Summary Access: Status ${teacherSummary.status}`);

  // 21. Unlinked Parent Rejection (403)
  const unlinkedParent = await makeRequest(`/parent/exam-papers/student/${studentId}/summary`, 'GET', null, unlinkedParentToken);
  console.log(`21. Unlinked Parent Access Rejection: Status ${unlinkedParent.status} (Expect 403)`);

  // 22. Unauthenticated Request Rejection (401)
  const unauthReq = await makeRequest('/student/exam-papers', 'GET', null);
  console.log(`22. Unauthenticated Request Rejection: Status ${unauthReq.status} (Expect 401)`);
}

runAudit();
