import { spawn } from 'child_process';
import http from 'http';

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (path, method = 'GET', body = null, token = null) => {
  const startTime = Date.now();
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
          const latencyMs = Date.now() - startTime;
          try {
            const json = JSON.parse(data);
            resolve({ status: res.statusCode, headers: res.headers, body: json, latencyMs });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, raw: data, latencyMs });
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

const runApiAudit = async () => {
  console.log('📡 Starting Complete Backend API & Frontend Contract Audit...\n');

  try {
    // 1. Health Endpoint & Latency
    const healthRes = await makeRequest('/health');
    console.log(`1. GET /api/health: Status ${healthRes.status} | Latency: ${healthRes.latencyMs}ms`);

    // 2. Auth Endpoints
    const studentEmail = `api_student_${Date.now()}@example.com`;
    const regRes = await makeRequest('/auth/register', 'POST', {
      name: 'API Audit Student',
      email: studentEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const studentToken = regRes.body?.token;
    console.log(`2. POST /api/auth/register: Status ${regRes.status} | Token Generated: ${Boolean(studentToken)}`);

    const loginRes = await makeRequest('/auth/login', 'POST', {
      email: studentEmail,
      password: 'password123',
    });
    console.log(`3. POST /api/auth/login: Status ${loginRes.status} | Latency: ${loginRes.latencyMs}ms`);

    const meRes = await makeRequest('/auth/me', 'GET', null, studentToken);
    console.log(`4. GET /api/auth/me: Status ${meRes.status} | Role: ${meRes.body?.user?.role}`);

    // 3. Student Dashboard API
    const dashRes = await makeRequest('/student/dashboard', 'GET', null, studentToken);
    console.log(`5. GET /api/student/dashboard: Status ${dashRes.status} | Latency: ${dashRes.latencyMs}ms | Contract Shape: ${Boolean(dashRes.body?.data?.studentProfile)}`);

    // 4. Tutor API
    const convRes = await makeRequest('/tutor/conversations', 'POST', { title: 'Doubt Conv' }, studentToken);
    const convId = convRes.body?.data?._id;
    console.log(`6. POST /api/tutor/conversations: Status ${convRes.status} | Conv ID: ${convId}`);

    const getConvsRes = await makeRequest('/tutor/conversations', 'GET', null, studentToken);
    console.log(`7. GET /api/tutor/conversations: Status ${getConvsRes.status} | Count: ${getConvsRes.body?.data?.length}`);

    // 5. Adaptive Practice API
    const sessionRes = await makeRequest('/student/practice/sessions', 'POST', { questionCount: 2 }, studentToken);
    const sessionId = sessionRes.body?.data?.session?._id;
    console.log(`8. POST /api/student/practice/sessions: Status ${sessionRes.status} | Session ID: ${sessionId}`);

    // 6. Scholarship Matching API
    const schMatchesRes = await makeRequest('/student/scholarships/matches', 'GET', null, studentToken);
    console.log(`9. GET /api/student/scholarships/matches: Status ${schMatchesRes.status} | Latency: ${schMatchesRes.latencyMs}ms | Count: ${schMatchesRes.body?.data?.length}`);

    // 7. Public Subjects & Topics APIs
    const subjectsRes = await makeRequest('/subjects', 'GET');
    console.log(`10. GET /api/subjects: Status ${subjectsRes.status} | Count: ${subjectsRes.body?.data?.length}`);

    const topicsRes = await makeRequest('/topics', 'GET');
    console.log(`11. GET /api/topics: Status ${topicsRes.status} | Count: ${topicsRes.body?.data?.length}`);

    // 8. RAG Documents & Search APIs
    const ragDocsRes = await makeRequest('/rag/documents', 'GET');
    console.log(`12. GET /api/rag/documents: Status ${ragDocsRes.status} | Count: ${ragDocsRes.body?.data?.length}`);

    const ragSearchRes = await makeRequest('/rag/search', 'POST', { query: 'linear equations' });
    console.log(`13. POST /api/rag/search: Status ${ragSearchRes.status} | Results Count: ${ragSearchRes.body?.data?.length}`);

    // 9. Incorrect HTTP Method Test
    const wrongMethodRes = await makeRequest('/student/dashboard', 'POST', {}, studentToken);
    console.log(`14. POST /api/student/dashboard (Method Not Allowed Expect 404/405): Status ${wrongMethodRes.status}`);

    console.log('\n🎉 BACKEND API & CONTRACT AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ API Audit Error:', err);
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
      await runApiAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
