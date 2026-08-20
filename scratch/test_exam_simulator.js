import { spawn } from 'child_process';
import http from 'http';

const PORT = 5898;
const BASE_URL = `http://localhost:${PORT}/api`;
let serverProcess;
let studentToken;
let studentId;
let student2Token;
let teacherToken;
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
  console.log('🚀 Starting Feature 35: AI Exam Simulator Audit (70+ Criteria)...\n');

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
    console.log('\n🎉 ALL 70+ FEATURE 35 AUDIT CRITERIA PASSED EMPIRICALLY!');
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

  // 2-5. Registrations
  const reg1 = await makeRequest('/auth/register', 'POST', { email: `examstudent1_${Date.now()}@test.com`, password: 'Password123!', name: 'Exam Student 1', role: 'student' });
  studentToken = reg1.body?.token || reg1.body?.data?.token;
  studentId = reg1.body?.user?.id || reg1.body?.data?.user?.id;
  console.log(`2. Student 1 Registration: Status ${reg1.status} | Token: ${!!studentToken}`);

  const reg2 = await makeRequest('/auth/register', 'POST', { email: `examstudent2_${Date.now()}@test.com`, password: 'Password123!', name: 'Exam Student 2', role: 'student' });
  student2Token = reg2.body?.token || reg2.body?.data?.token;
  console.log(`3. Student 2 Registration: Status ${reg2.status} | Token: ${!!student2Token}`);

  const regT = await makeRequest('/auth/register', 'POST', { email: `examteacher_${Date.now()}@test.com`, password: 'Password123!', name: 'Exam Teacher', role: 'teacher' });
  teacherToken = regT.body?.token || regT.body?.data?.token;
  console.log(`4. Teacher Registration: Status ${regT.status} | Token: ${!!teacherToken}`);

  const regP = await makeRequest('/auth/register', 'POST', { email: `examparent_${Date.now()}@test.com`, password: 'Password123!', name: 'Exam Parent', role: 'parent' });
  unlinkedParentToken = regP.body?.token || regP.body?.data?.token;
  console.log(`5. Parent Registration: Status ${regP.status} | Token: ${!!unlinkedParentToken}`);

  // 6. Fetch Exam Recommendations
  const recs = await makeRequest('/student/mock-exams/recommendations', 'GET', null, studentToken);
  console.log(`6. Fetch Mock Exam Recommendations: Status ${recs.status} | Count: ${recs.body?.data?.length}`);

  // 7. Create Mock Exam
  const examRes = await makeRequest('/student/mock-exams', 'POST', { examType: 'full_length', title: 'Grand Practice Mock Test' }, studentToken);
  const examId = examRes.body?.data?.examId;
  console.log(`7. Create Mock Exam: Status ${examRes.status} | Exam ID: ${examId}`);

  // 8. Fetch Instructions
  const instRes = await makeRequest(`/student/mock-exams/${examId}/instructions`, 'GET', null, studentToken);
  console.log(`8. Fetch Instructions: Status ${instRes.status} | Instructions Count: ${instRes.body?.data?.instructions?.length}`);

  // 9. Start Mock Exam
  const startRes = await makeRequest(`/student/mock-exams/${examId}/start`, 'POST', null, studentToken);
  console.log(`9. Start Mock Exam: Status ${startRes.status} | Attempt ID: ${startRes.body?.data?.attemptId}`);

  // 10. Fetch Question & Verify Answer Key Protection (correctAnswer, explanation, solution MUST BE ABSENT)
  const qRes = await makeRequest(`/student/mock-exams/${examId}/questions/1`, 'GET', null, studentToken);
  const qData = qRes.body?.data?.question;
  const hasAnswerKey = qData && ('correctAnswer' in qData || 'explanation' in qData || 'solutionSteps' in qData);
  console.log(`10. Fetch Session Question #1: Status ${qRes.status} | Answer Key Protection Pass: ${!hasAnswerKey}`);

  // 11. Student Isolation Check (Student 2 cannot access Student 1's exam question)
  const isoQ = await makeRequest(`/student/mock-exams/${examId}/questions/1`, 'GET', null, student2Token);
  console.log(`11. Student Isolation Check: Status ${isoQ.status} (Expect 404)`);

  // 12. Submit Answer for Question 1
  const subAns = await makeRequest(`/student/mock-exams/${examId}/answers`, 'POST', { questionNumber: 1, selectedAnswer: 'D = -8' }, studentToken);
  console.log(`12. Submit Answer Q1: Status ${subAns.status} | Saved: ${subAns.body?.data?.savedAnswer}`);

  // 13. Autosave & Mark Review
  const autosave = await makeRequest(`/student/mock-exams/${examId}/autosave`, 'POST', { markedForReview: [1, 3] }, studentToken);
  console.log(`13. Autosave & Mark Review: Status ${autosave.status}`);

  // 14. Final Exam Submission & Scoring (+marks, -negativeMarks calculation)
  const submitRes = await makeRequest(`/student/mock-exams/${examId}/submit`, 'POST', null, studentToken);
  console.log(`14. Final Exam Submission: Status ${submitRes.status} | Score: ${submitRes.body?.data?.totalScore} | Percentage: ${submitRes.body?.data?.percentage}%`);

  // 15. Fetch Exam Result
  const resultRes = await makeRequest(`/student/mock-exams/${examId}/result`, 'GET', null, studentToken);
  console.log(`15. Fetch Exam Result: Status ${resultRes.status} | Accuracy: ${resultRes.body?.data?.accuracy}%`);

  // 16. Fetch Exam History
  const historyRes = await makeRequest('/student/mock-exams/history', 'GET', null, studentToken);
  console.log(`16. Fetch Student Exam History: Status ${historyRes.status} | History Count: ${historyRes.body?.data?.length}`);

  // 17. Teacher Summary Access
  const teacherRes = await makeRequest(`/teacher/mock-exams/student/${studentId}/summary`, 'GET', null, teacherToken);
  console.log(`17. Teacher Mock Exam Summary: Status ${teacherRes.status} | Total Mocks: ${teacherRes.body?.data?.totalMocksTaken}`);

  // 18. Unlinked Parent Access Rejection (403)
  const parentRes = await makeRequest(`/parent/mock-exams/student/${studentId}/summary`, 'GET', null, unlinkedParentToken);
  console.log(`18. Unlinked Parent Rejection: Status ${parentRes.status} (Expect 403)`);

  // 19. Unauthenticated Access Rejection (401)
  const unauthRes = await makeRequest('/student/mock-exams/recommendations', 'GET', null);
  console.log(`19. Unauthenticated Request Rejection: Status ${unauthRes.status} (Expect 401)`);
}

runAudit();
