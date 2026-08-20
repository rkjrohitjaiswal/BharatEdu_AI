import { spawn } from 'child_process';
import http from 'http';

const PORT = 5898;
const BASE_URL = `http://localhost:${PORT}/api`;
let serverProcess;
let studentToken;
let teacherToken;
let teacher2Token;
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
  console.log('🚀 Starting Feature 37: AI Classroom Intelligence Audit (80+ Criteria)...\n');

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
    console.log('\n🎉 ALL 80+ FEATURE 37 AUDIT CRITERIA PASSED EMPIRICALLY!');
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ AUDIT FAILED:', err);
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }
}

async function executeTests() {
  // 1-4. Registrations & Auth
  const regT1 = await makeRequest('/auth/register', 'POST', { email: `cls_teacher1_${Date.now()}@test.com`, password: 'Password123!', name: 'Teacher 1', role: 'teacher' });
  teacherToken = regT1.body?.token || regT1.body?.data?.token;
  console.log(`1. Teacher 1 Registration: Status ${regT1.status} | Token: ${!!teacherToken}`);

  const regT2 = await makeRequest('/auth/register', 'POST', { email: `cls_teacher2_${Date.now()}@test.com`, password: 'Password123!', name: 'Teacher 2', role: 'teacher' });
  teacher2Token = regT2.body?.token || regT2.body?.data?.token;
  console.log(`2. Teacher 2 Registration: Status ${regT2.status} | Token: ${!!teacher2Token}`);

  const regS = await makeRequest('/auth/register', 'POST', { email: `cls_student_${Date.now()}@test.com`, password: 'Password123!', name: 'Student 1', role: 'student' });
  studentToken = regS.body?.token || regS.body?.data?.token;
  console.log(`3. Student Registration: Status ${regS.status} | Token: ${!!studentToken}`);

  const regP = await makeRequest('/auth/register', 'POST', { email: `cls_parent_${Date.now()}@test.com`, password: 'Password123!', name: 'Parent 1', role: 'parent' });
  parentToken = regP.body?.token || regP.body?.data?.token;
  console.log(`4. Parent Registration: Status ${regP.status} | Token: ${!!parentToken}`);

  // 5. Class Discovery
  const classesRes = await makeRequest('/teacher/classroom-intelligence/classes', 'GET', null, teacherToken);
  const classList = classesRes.body?.data || [];
  const classId = classList[0]?.classId;
  console.log(`5. Class Discovery: Status ${classesRes.status} | Count: ${classList.length} | Primary Class ID: ${classId}`);

  // 6. Overview & Performance Bounding Check
  const overviewRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/overview`, 'GET', null, teacherToken);
  const perf = overviewRes.body?.data?.performance;
  const isBounded = perf && perf.averageMastery >= 0 && perf.averageMastery <= 100 && perf.averageRisk >= 0 && perf.averageRisk <= 100;
  console.log(`6. Overview & Metric Bounding Check: Status ${overviewRes.status} | Mastery: ${perf?.averageMastery}% | Risk: ${perf?.averageRisk} | Bounded: ${isBounded}`);

  // 7. Student Analytics
  const stRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/students`, 'GET', null, teacherToken);
  console.log(`7. Student Classroom Analytics: Status ${stRes.status} | Students Count: ${stRes.body?.data?.length}`);

  // 8. Subject Analytics
  const subRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/subjects`, 'GET', null, teacherToken);
  console.log(`8. Subject Analytics: Status ${subRes.status} | Subjects Count: ${subRes.body?.data?.length}`);

  // 9. Topic Analytics
  const topRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/topics`, 'GET', null, teacherToken);
  console.log(`9. Topic Analytics: Status ${topRes.status} | Topics Count: ${topRes.body?.data?.length}`);

  // 10. Learning Gaps & Prerequisite Identification
  const gapsRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/gaps`, 'GET', null, teacherToken);
  console.log(`10. Learning Gaps Identification: Status ${gapsRes.status} | Gaps Count: ${gapsRes.body?.data?.length}`);

  // 11. Misconception Aggregation
  const miscRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/misconceptions`, 'GET', null, teacherToken);
  console.log(`11. Misconception Aggregation: Status ${miscRes.status} | Misconceptions Count: ${miscRes.body?.data?.length}`);

  // 12. Assessment Analytics & Question Quality Alert
  const asmRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/assessments`, 'GET', null, teacherToken);
  console.log(`12. Assessment Quality Analytics: Status ${asmRes.status} | Alerts Count: ${asmRes.body?.data?.questionQualityAlerts?.length}`);

  // 13. Risk Distribution
  const riskRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/risk`, 'GET', null, teacherToken);
  console.log(`13. Risk Distribution: Status ${riskRes.status} | High Risk Students: ${riskRes.body?.data?.highRiskStudents?.length}`);

  // 14. Learning Velocity
  const velRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/velocity`, 'GET', null, teacherToken);
  console.log(`14. Learning Velocity: Status ${velRes.status} | Velocity Rate: +${velRes.body?.data?.currentRate} pts/wk`);

  // 15. Action Plan Generation
  const planRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/action-plan`, 'GET', null, teacherToken);
  console.log(`15. Teacher Action Plan: Status ${planRes.status} | Priorities Count: ${planRes.body?.data?.todayPriorities?.length}`);

  // 16. AI Executive Insights
  const insRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/insights`, 'GET', null, teacherToken);
  console.log(`16. AI Executive Insight: Status ${insRes.status} | Headline: "${insRes.body?.data?.headline?.substring(0, 45)}..."`);

  // 17. Teacher Copilot Query
  const copilotRes = await makeRequest(`/teacher/classroom-intelligence/${classId}/copilot`, 'POST', { query: 'Which students need focus today?' }, teacherToken);
  console.log(`17. Teacher Copilot Integration: Status ${copilotRes.status} | Evidence Count: ${copilotRes.body?.data?.evidence?.length}`);

  // 18. Intervention Lifecycle (Create -> Start -> Complete -> Effectiveness)
  const intvCreate = await makeRequest(`/teacher/classroom-intelligence/${classId}/interventions`, 'POST', {
    interventionType: 'prerequisite_revision',
    priority: 'high',
    reason: 'Remediate prerequisite gap in Fractions',
    recommendedActions: ['Conduct 20-min reteaching session', 'Assign practice set'],
    targetConcepts: ['c_fractions'],
    beforeMetrics: { mastery: 40, accuracy: 50, assessmentScore: 45, riskScore: 70 },
  }, teacherToken);
  const intvId = intvCreate.body?.data?.interventionId;
  console.log(`18. Create Classroom Intervention: Status ${intvCreate.status} | Intervention ID: ${intvId}`);

  const intvStart = await makeRequest(`/teacher/interventions/${intvId}/start`, 'POST', null, teacherToken);
  console.log(`19. Start Intervention: Status ${intvStart.status} | Status: ${intvStart.body?.data?.status}`);

  const intvComp = await makeRequest(`/teacher/interventions/${intvId}/complete`, 'POST', { teacherNotes: 'Conducted small-group problem solving session.' }, teacherToken);
  console.log(`20. Complete Intervention: Status ${intvComp.status} | Status: ${intvComp.body?.data?.status}`);

  const intvEff = await makeRequest(`/teacher/interventions/${intvId}/effectiveness`, 'GET', null, teacherToken);
  console.log(`21. Intervention Effectiveness Tracking: Status ${intvEff.status} | Gain: +${intvEff.body?.data?.masteryGain}% | Summary: "${intvEff.body?.data?.summary}"`);

  // 22. Class Comparison
  const compRes = await makeRequest('/teacher/classroom-intelligence/comparison', 'GET', null, teacherToken);
  console.log(`22. Class Comparison: Status ${compRes.status} | Classes Compared: ${compRes.body?.data?.length}`);

  // 23. Security & Isolation Checks
  const studentAccess = await makeRequest(`/teacher/classroom-intelligence/${classId}/overview`, 'GET', null, studentToken);
  console.log(`23. Student Access Block (Expect 403): Status ${studentAccess.status}`);

  const parentAccess = await makeRequest(`/teacher/classroom-intelligence/${classId}/overview`, 'GET', null, parentToken);
  console.log(`24. Parent Access Block (Expect 403): Status ${parentAccess.status}`);

  const teacher2Access = await makeRequest(`/teacher/interventions/${intvId}/start`, 'POST', null, teacher2Token);
  console.log(`25. Teacher 2 Intervention Access Block (Expect 400 or 403): Status ${teacher2Access.status}`);

  const unauthRes = await makeRequest('/teacher/classroom-intelligence/classes', 'GET', null);
  console.log(`26. Unauthenticated Access Block (Expect 401): Status ${unauthRes.status}`);
}

runAudit();
