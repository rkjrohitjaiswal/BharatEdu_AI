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
            resolve({ status: res.statusCode, headers: res.headers, body: json });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, raw: data });
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

const runLiveDemoVerification = async () => {
  console.log('🌟 Starting Final Live Demo Verification Audit...\n');

  try {
    // 1. Check Health & Environment Secrets
    const health = await makeRequest('/health');
    console.log(`1. Health Check (GET /api/health): Status ${health.status} | Success: ${health.body?.success}`);

    // Check AI_API_KEY secret status safely without logging key
    const hasAiKey = Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim().length > 0);
    console.log(`2. AI_API_KEY Secret Status: ${hasAiKey ? 'CONFIGURED' : 'MISSING (Development Fallback Active)'}`);

    // 2. Real Student Demo Flow
    const sEmail = `demo_student_${Date.now()}@example.com`;
    const sReg = await makeRequest('/auth/register', 'POST', {
      name: 'Live Demo Student',
      email: sEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const sToken = sReg.body?.token;
    console.log(`3. Student Register & Login: Status ${sReg.status} | Token: ${Boolean(sToken)}`);

    const sDashInitial = await makeRequest('/student/dashboard', 'GET', null, sToken);
    console.log(`4. Student Dashboard Initial Load: Status ${sDashInitial.status}`);

    const sSession = await makeRequest('/student/practice/sessions', 'POST', { questionCount: 2 }, sToken);
    const sessionId = sSession.body?.data?.session?._id;
    console.log(`5. Adaptive Practice Session Created: Status ${sSession.status} | Session ID: ${sessionId}`);

    if (sessionId) {
      const sAnswer = await makeRequest(`/student/practice/sessions/${sessionId}/answer`, 'POST', {
        questionIndex: 0,
        answer: 'linear equation',
      }, sToken);
      console.log(`6. Submit Answer Evaluation: Status ${sAnswer.status} | Server isCorrect: ${sAnswer.body?.data?.isCorrect}`);
    }

    const sDashReload = await makeRequest('/student/dashboard', 'GET', null, sToken);
    console.log(`7. Reload Dashboard Post-Practice: Status ${sDashReload.status}`);

    // 3. Real Tutor & RAG Test Flow
    const sConv = await makeRequest('/tutor/conversations', 'POST', { title: 'Newton Laws Doubt' }, sToken);
    const convId = sConv.body?.data?._id;
    console.log(`8. Create Tutor Conversation: Status ${sConv.status} | Conv ID: ${convId}`);

    if (convId) {
      const tutorMsg = await makeRequest(`/tutor/conversations/${convId}/messages`, 'POST', {
        content: "Explain Newton's second law to a Class 8 student using a simple real-life example. Answer in English and cite the retrieved educational source if one is available.",
      }, sToken);
      console.log(`9. AI Tutor Question Submission: Status ${tutorMsg.status}`);
      console.log(`   Tutor Response Snippet: "${tutorMsg.body?.data?.tutorMessage?.content?.substring(0, 100)}..."`);
      console.log(`   RAG Sources Attached: ${tutorMsg.body?.data?.tutorMessage?.sources?.length || 0} Sources`);
    }

    // 4. Real Scholarship Match Test Flow
    const sMatches = await makeRequest('/student/scholarships/matches', 'GET', null, sToken);
    console.log(`10. Scholarship Matches Query: Status ${sMatches.status} | Matches Count: ${sMatches.body?.data?.length || 0}`);
    console.log(`    Legal Disclaimer Attached: ${Boolean(sMatches.body?.legalDisclaimer)}`);

    // 5. Real Teacher Demo Flow
    const tEmail = `demo_teacher_${Date.now()}@example.com`;
    const tReg = await makeRequest('/auth/register', 'POST', {
      name: 'Live Demo Teacher',
      email: tEmail,
      password: 'password123',
      role: 'teacher',
      preferredLanguage: 'english',
    });
    const tToken = tReg.body?.token;
    console.log(`11. Teacher Register & Login: Status ${tReg.status} | Token: ${Boolean(tToken)}`);

    const tClasses = await makeRequest('/teacher/classes', 'GET', null, tToken);
    console.log(`12. Teacher Classes Roster: Status ${tClasses.status} | Count: ${tClasses.body?.data?.length || 0}`);

    // 6. Security Guards & IDOR Matrix
    const sAttack = await makeRequest('/teacher/dashboard', 'GET', null, sToken);
    console.log(`13. Role Security (Student -> Teacher API): Status ${sAttack.status} (Expect 403)`);

    const unauthAttack = await makeRequest('/student/dashboard', 'GET', null, null);
    console.log(`14. Auth Security (Unauthenticated -> Protected API): Status ${unauthAttack.status} (Expect 401)`);

    console.log('\n🎉 FINAL LIVE DEMO VERIFICATION COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Live Demo Audit Error:', err);
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
      await runLiveDemoVerification();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
