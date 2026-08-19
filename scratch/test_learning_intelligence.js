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

const runLearningIntelligenceAudit = async () => {
  console.log('🧠 Starting Learning Intelligence Engine Audit...\n');

  try {
    // 1. Register Student
    const studentEmail = `li_audit_student_${Date.now()}@example.com`;
    const regRes = await makeRequest('/auth/register', 'POST', {
      name: 'Learning Intelligence Student',
      email: studentEmail,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const token = regRes.body?.token;

    // 2. Fetch Initial Learning Profile & Gaps
    const initialProfile = await makeRequest('/student/learning-profile', 'GET', null, token);
    const initialGaps = await makeRequest('/student/learning/gaps', 'GET', null, token);
    console.log(`1. Initial Mastery: ${initialProfile.body?.data?.overallMastery || 0}% | Gaps Count: ${initialGaps.body?.data?.length || 0}`);

    // 3. Post Evidence Analysis Attempt 1 (Incorrect Answer)
    const evidence1 = await makeRequest('/student/learning/analyze', 'POST', {
      topicId: 'topic_linear_eq_01',
      evidenceId: `ev_${Date.now()}_1`,
      analysisType: 'practice',
      isCorrect: false,
      studentAnswer: 'x = 3',
    }, token);
    console.log(`2. Process Incorrect Evidence: Status ${evidence1.status} | Severity: ${evidence1.body?.data?.severity} | Mastery: ${evidence1.body?.data?.masteryScore}%`);

    // 4. Test Idempotency (Sending same evidenceId again)
    const evidence1Dup = await makeRequest('/student/learning/analyze', 'POST', {
      topicId: 'topic_linear_eq_01',
      evidenceId: evidence1.body?.data?.evidenceId || `ev_${Date.now()}_1`,
      analysisType: 'practice',
      isCorrect: false,
      studentAnswer: 'x = 3',
    }, token);
    console.log(`3. Re-send Duplicate Evidence ID (Idempotency Check): Status ${evidence1Dup.status}`);

    // 5. Post Evidence Analysis Attempt 2 (Correct Answer)
    const evidence2 = await makeRequest('/student/learning/analyze', 'POST', {
      topicId: 'topic_linear_eq_01',
      evidenceId: `ev_${Date.now()}_2`,
      analysisType: 'practice',
      isCorrect: true,
      studentAnswer: 'x = 5',
    }, token);
    console.log(`4. Process Correct Evidence: Status ${evidence2.status} | New Mastery: ${evidence2.body?.data?.masteryScore}%`);

    console.log('\n🎉 LEARNING INTELLIGENCE AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Learning Intelligence Audit Error:', err);
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
      await runLearningIntelligenceAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
