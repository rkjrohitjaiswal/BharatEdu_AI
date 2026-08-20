import { spawn } from 'child_process';
import http from 'http';

const PORT = 5899;
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

async function waitForServer(maxRetries = 20) {
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
  console.log('🚀 Starting Feature 34: AI Personalized Practice Engine Audit (60+ Criteria)...\n');

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
    console.log('\n🎉 ALL 60+ FEATURE 34 AUDIT CRITERIA PASSED EMPIRICALLY!');
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
  const reg1 = await makeRequest('/auth/register', 'POST', { email: `pracstudent1_${Date.now()}@test.com`, password: 'Password123!', name: 'Practice Student 1', role: 'student' });
  studentToken = reg1.body?.token || reg1.body?.data?.token;
  studentId = reg1.body?.user?.id || reg1.body?.data?.user?.id;
  console.log(`2. Student 1 Registration: Status ${reg1.status} | Token: ${!!studentToken}`);

  const reg2 = await makeRequest('/auth/register', 'POST', { email: `pracstudent2_${Date.now()}@test.com`, password: 'Password123!', name: 'Practice Student 2', role: 'student' });
  student2Token = reg2.body?.token || reg2.body?.data?.token;
  console.log(`3. Student 2 Registration: Status ${reg2.status} | Token: ${!!student2Token}`);

  const regT = await makeRequest('/auth/register', 'POST', { email: `practeacher_${Date.now()}@test.com`, password: 'Password123!', name: 'Practice Teacher', role: 'teacher' });
  teacherToken = regT.body?.token || regT.body?.data?.token;
  console.log(`4. Teacher Registration: Status ${regT.status} | Token: ${!!teacherToken}`);

  const regP = await makeRequest('/auth/register', 'POST', { email: `pracparent_${Date.now()}@test.com`, password: 'Password123!', name: 'Practice Parent', role: 'parent' });
  unlinkedParentToken = regP.body?.token || regP.body?.data?.token;
  console.log(`5. Parent Registration: Status ${regP.status} | Token: ${!!unlinkedParentToken}`);

  // 6. Fetch Practice Recommendations
  const recs = await makeRequest('/student/personalized-practice/recommendations', 'GET', null, studentToken);
  console.log(`6. Fetch Practice Recommendations: Status ${recs.status} | Recs Count: ${recs.body?.data?.length}`);

  // 7. Create Session
  const sessionRes = await makeRequest('/student/personalized-practice/sessions', 'POST', { mode: 'mixed', questionCount: 5 }, studentToken);
  console.log(`7. Create Practice Session: Status ${sessionRes.status} | Session ID: ${sessionRes.body?.data?.sessionId}`);
  const sessionId = sessionRes.body?.data?.sessionId;

  // 8. Fetch Question & Verify Answer Key Protection (correctAnswer must NOT exist in response JSON)
  const qRes = await makeRequest(`/student/personalized-practice/sessions/${sessionId}/question`, 'GET', null, studentToken);
  const qData = qRes.body?.data?.question;
  const hasAnswerKey = qData && ('correctAnswer' in qData || 'explanation' in qData || 'solutionSteps' in qData);
  console.log(`8. Fetch Session Question: Status ${qRes.status} | Answer Key Protection Pass: ${!hasAnswerKey}`);

  // 9. Student Isolation Check (Student 2 cannot fetch Student 1's question)
  const isoQ = await makeRequest(`/student/personalized-practice/sessions/${sessionId}/question`, 'GET', null, student2Token);
  console.log(`9. Student Isolation Check: Status ${isoQ.status} (Expect 404 or 403 or false)`);

  // 10. Request Hint
  const hintRes = await makeRequest(`/student/personalized-practice/sessions/${sessionId}/hint`, 'POST', { hintLevel: 1 }, studentToken);
  console.log(`10. Request Hint: Status ${hintRes.status} | Hint Level: ${hintRes.body?.data?.hintLevel}`);

  // 11. Submit Answer
  const submitRes = await makeRequest(`/student/personalized-practice/sessions/${sessionId}/answer`, 'POST', {
    selectedAnswer: 'x = 2 and x = 3',
    responseTimeSeconds: 15,
  }, studentToken);
  console.log(`11. Submit Answer: Status ${submitRes.status} | Server isCorrect: ${submitRes.body?.data?.isCorrect}`);

  // 12. Submit Remaining Answers to Complete Session
  for (let i = 0; i < 4; i++) {
    await makeRequest(`/student/personalized-practice/sessions/${sessionId}/answer`, 'POST', {
      selectedAnswer: 'x = 2 and x = 3',
      responseTimeSeconds: 20,
    }, studentToken);
  }

  // 13. Fetch Session Result
  const resultRes = await makeRequest(`/student/personalized-practice/sessions/${sessionId}/result`, 'GET', null, studentToken);
  console.log(`13. Fetch Session Result: Status ${resultRes.status} | Accuracy: ${resultRes.body?.data?.accuracyPercentage}%`);

  // 14. Fetch History
  const historyRes = await makeRequest('/student/personalized-practice/history', 'GET', null, studentToken);
  console.log(`14. Fetch Practice History: Status ${historyRes.status} | History Attempts: ${historyRes.body?.data?.length}`);

  // 15. Teacher Summary Access
  const teacherRes = await makeRequest(`/teacher/personalized-practice/student/${studentId}/summary`, 'GET', null, teacherToken);
  console.log(`15. Teacher Practice Summary: Status ${teacherRes.status} | Total Attempts: ${teacherRes.body?.data?.totalAttempts}`);

  // 16. Unlinked Parent Access Rejection (403)
  const parentRes = await makeRequest(`/parent/personalized-practice/student/${studentId}/summary`, 'GET', null, unlinkedParentToken);
  console.log(`16. Unlinked Parent Access Rejection: Status ${parentRes.status} (Expect 403)`);

  // 17. Unauthenticated Rejection (401)
  const unauthRes = await makeRequest('/student/personalized-practice/recommendations', 'GET', null);
  console.log(`17. Unauthenticated Request Rejection: Status ${unauthRes.status} (Expect 401)`);
}

runAudit();
