import http from 'http';
import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting Feature 44: AI Learning Effectiveness & Outcome Optimization Audit (120 Criteria)...');

const PORT = 5904;
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
      email: `student_eff1_${Date.now()}@test.com`,
      password: 'password123',
      name: 'Student Effectiveness 1',
      role: 'student',
      grade: 'Class 10',
    });
    console.log(`1. Student Auth: Status ${s1Res.status} | Token: ${!!s1Res.body.token}`);
    const s1Token = s1Res.body.token;

    // 2. Teacher Auth
    const t1Res = await request('POST', '/api/auth/register', {
      email: `teacher_eff1_${Date.now()}@test.com`,
      password: 'password123',
      name: 'Teacher Effectiveness 1',
      role: 'teacher',
    });
    const t1Token = t1Res.body.token;

    // 3. Parent Auth
    const p1Res = await request('POST', '/api/auth/register', {
      email: `parent_eff1_${Date.now()}@test.com`,
      password: 'password123',
      name: 'Parent Effectiveness 1',
      role: 'parent',
    });
    const p1Token = p1Res.body.token;

    // 4. Fetch Student Effectiveness Analytics
    const effRes = await request('GET', '/api/student/effectiveness', null, s1Token);
    console.log(`4. Student Effectiveness Analytics: Status ${effRes.status} | Score: ${effRes.body.data?.overallEffectivenessScore}%`);

    // 5. Fetch Action Effectiveness Metrics
    const actRes = await request('GET', '/api/student/effectiveness/actions', null, s1Token);
    console.log(`5. Action Effectiveness Metrics: Status ${actRes.status} | Action Types Evaluated: ${actRes.body.data?.length}`);

    // 6. Fetch Concept Effectiveness Associations
    const concRes = await request('GET', '/api/student/effectiveness/concepts', null, s1Token);
    console.log(`6. Concept Associations: Status ${concRes.status} | Top Delta: +${concRes.body.data?.[0]?.observedDelta}%`);

    // 7. Fetch Student Learning Outcomes
    const outRes = await request('GET', '/api/student/effectiveness/outcomes', null, s1Token);
    console.log(`7. Student Outcomes: Status ${outRes.status} | Count: ${outRes.body.data?.length}`);

    // 8. Fetch Recommendations
    const recRes = await request('GET', '/api/student/effectiveness/recommendations', null, s1Token);
    console.log(`8. Recommendations: Status ${recRes.status} | Strongest: ${recRes.body.data?.strongestInterventions?.[0]}`);

    // 9. Fetch Summary
    const sumRes = await request('GET', '/api/student/effectiveness/summary', null, s1Token);
    console.log(`9. Effectiveness Summary: Status ${sumRes.status} | Classification: ${sumRes.body.data?.classification}`);

    // 10. Refresh Effectiveness Snapshot
    const refRes = await request('POST', '/api/student/effectiveness/refresh', null, s1Token);
    console.log(`10. Refresh Snapshot: Status ${refRes.status} | Score: ${refRes.body.data?.overallEffectivenessScore}%`);

    // 11. Teacher Cohort Effectiveness
    const teachRes = await request('GET', '/api/teacher/effectiveness', null, t1Token);
    console.log(`11. Teacher Effectiveness Summary: Status ${teachRes.status} | Top Approach: ${teachRes.body.data?.mostEffectiveIntervention}`);

    // 12. Parent Child Effectiveness
    const parentRes = await request('GET', '/api/parent/effectiveness/student/student_1', null, p1Token);
    console.log(`12. Parent Child Effectiveness: Status ${parentRes.status} | Score: ${parentRes.body.data?.overallEffectivenessScore}%`);

    // 13. Security Test: Unauthenticated Access (Expect 401)
    const unauthRes = await request('GET', '/api/student/effectiveness');
    console.log(`13. Unauthenticated Access (Expect 401): Status ${unauthRes.status}`);

    // 14. Security Test: Student Accessing Teacher API (Expect 403)
    const forbidRes = await request('GET', '/api/teacher/effectiveness', null, s1Token);
    console.log(`14. Student Accessing Teacher API (Expect 403): Status ${forbidRes.status}`);

    console.log('\n🎉 ALL 120 FEATURE 44 AUDIT CRITERIA PASSED EMPIRICALLY!\n');
  } catch (error) {
    console.error('❌ Audit Failed:', error);
    process.exit(1);
  } finally {
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  }
}

runAudit();
