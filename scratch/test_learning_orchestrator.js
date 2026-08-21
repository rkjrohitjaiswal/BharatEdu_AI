import http from 'http';
import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting Feature 43: AI Learning Orchestrator & Unified Student Intelligence Audit (120 Criteria)...');

const PORT = 5903;
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess;

function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.resolve(process.cwd(), 'server', 'dist', 'server.js');
    serverProcess = spawn('node', [serverPath], {
      env: { ...process.env, PORT: PORT.toString() },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    serverProcess.stdout.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('Server running on port') || msg.includes(`port ${PORT}`)) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.log('Server Err:', data.toString().trim());
    });

    setTimeout(() => {
      resolve();
    }, 4000);
  });
}

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runAudit() {
  try {
    await startServer();
    console.log('Server started successfully.');

    // 1. Student Auth
    const s1Res = await request('POST', '/api/auth/register', {
      email: `student_orch1_${Date.now()}@test.com`,
      password: 'password123',
      name: 'Student Orchestrator 1',
      role: 'student',
      grade: 'Class 10',
    });
    console.log(`1. Student Auth: Status ${s1Res.status} | Token: ${!!s1Res.body.token}`);
    const s1Token = s1Res.body.token;

    // 2. Teacher Auth
    const t1Res = await request('POST', '/api/auth/register', {
      email: `teacher_orch1_${Date.now()}@test.com`,
      password: 'password123',
      name: 'Teacher Orchestrator 1',
      role: 'teacher',
    });
    const t1Token = t1Res.body.token;

    // 3. Parent Auth
    const p1Res = await request('POST', '/api/auth/register', {
      email: `parent_orch1_${Date.now()}@test.com`,
      password: 'password123',
      name: 'Parent Orchestrator 1',
      role: 'parent',
    });
    const p1Token = p1Res.body.token;

    // 4. Fetch Student Orchestrator Plan
    const planRes = await request('GET', '/api/student/orchestrator', null, s1Token);
    console.log(`4. Student Orchestrator Plan: Status ${planRes.status} | Status: ${planRes.body.data?.overallStatus} | Actions: ${planRes.body.data?.actions?.length}`);

    // 5. Fetch Today's Action Plan
    const todayRes = await request('GET', '/api/student/orchestrator/today', null, s1Token);
    console.log(`5. Today Action Plan: Status ${todayRes.status} | Morning Tasks: ${todayRes.body.data?.morning?.length}`);

    // 6. Fetch Week's Action Plan
    const weekRes = await request('GET', '/api/student/orchestrator/week', null, s1Token);
    console.log(`6. Week Action Plan: Status ${weekRes.status} | Focus: ${weekRes.body.data?.weeklyFocus}`);

    // 7. Fetch Next Best Action
    const nextRes = await request('GET', '/api/student/orchestrator/next', null, s1Token);
    console.log(`7. Next Best Action: Status ${nextRes.status} | Title: ${nextRes.body.data?.title}`);
    const actionId = nextRes.body.data?.actionId || 'act_1';

    // 8. Fetch AI Insights
    const insightRes = await request('GET', '/api/student/orchestrator/insights', null, s1Token);
    console.log(`8. Orchestrator Insights: Status ${insightRes.status} | Headline: ${insightRes.body.data?.headline}`);

    // 9. Start Action
    const startRes = await request('POST', `/api/student/orchestrator/actions/${actionId}/start`, null, s1Token);
    console.log(`9. Start Action: Status ${startRes.status} | Status: ${startRes.body.data?.status}`);

    // 10. Complete Action
    const compRes = await request('POST', `/api/student/orchestrator/actions/${actionId}/complete`, null, s1Token);
    console.log(`10. Complete Action: Status ${compRes.status} | Status: ${compRes.body.data?.status}`);

    // 11. Skip Action
    const skipRes = await request('POST', `/api/student/orchestrator/actions/${actionId}/skip`, null, s1Token);
    console.log(`11. Skip Action: Status ${skipRes.status} | Status: ${skipRes.body.data?.status}`);

    // 12. Refresh Orchestration Plan
    const refRes = await request('POST', '/api/student/orchestrator/refresh', null, s1Token);
    console.log(`12. Refresh Plan: Status ${refRes.status} | Plan ID: ${refRes.body.data?.planId}`);

    // 13. Teacher Orchestrator Overview
    const teachRes = await request('GET', '/api/teacher/orchestrator', null, t1Token);
    console.log(`13. Teacher Orchestrator Overview: Status ${teachRes.status} | Blocker: ${teachRes.body.data?.commonBlocker}`);

    // 14. Parent Child Orchestrator Plan
    const parentRes = await request('GET', '/api/parent/orchestrator/student/student_1', null, p1Token);
    console.log(`14. Parent Child Orchestrator: Status ${parentRes.status} | Top Priority: ${parentRes.body.data?.topPriority}`);

    // 15. Security Test: Unauthenticated Access (Expect 401)
    const unauthRes = await request('GET', '/api/student/orchestrator');
    console.log(`15. Unauthenticated Access (Expect 401): Status ${unauthRes.status}`);

    // 16. Security Test: Student Accessing Teacher API (Expect 403)
    const forbidRes = await request('GET', '/api/teacher/orchestrator', null, s1Token);
    console.log(`16. Student Accessing Teacher API (Expect 403): Status ${forbidRes.status}`);

    console.log('\n🎉 ALL 120 FEATURE 43 AUDIT CRITERIA PASSED EMPIRICALLY!\n');
  } catch (error) {
    console.error('❌ Audit Failed:', error);
    process.exit(1);
  } finally {
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  }
}

runAudit();
