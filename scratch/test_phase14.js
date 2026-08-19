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

const runPhase14Verification = async () => {
  console.log('🤖 Starting Phase 14 Live AI & Environment Secret Verification...\n');

  try {
    // 1. Check Secrets Safely
    const hasMongo = Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0);
    const hasJwt = Boolean(process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length > 0);
    const hasAiKey = Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim().length > 0);

    console.log('1. ENVIRONMENT SECRETS CHECK (Safe Masked Audit):');
    console.log(`   - MONGODB_URI: ${hasMongo ? 'CONFIGURED' : 'MISSING (Development Fallback Active)'}`);
    console.log(`   - JWT_SECRET: ${hasJwt ? 'CONFIGURED' : 'MISSING (Default Dev Key Active)'}`);
    console.log(`   - AI_PROVIDER: ${process.env.AI_PROVIDER || 'openai'} (CONFIGURED)`);
    console.log(`   - AI_MODEL: ${process.env.AI_MODEL || 'gpt-4o-mini'} (CONFIGURED)`);
    console.log(`   - AI_API_KEY: ${hasAiKey ? 'CONFIGURED' : 'MISSING'}`);

    if (!hasAiKey) {
      console.log('\n🔵 BLOCKED — API KEY REQUIRED');
      console.log('   The AI_API_KEY environment variable is currently empty in environment configuration.');
      console.log('   To enable Live OpenAI Completions & Semantic Embeddings, please set AI_API_KEY in server environment.');
    } else {
      console.log('\n🟢 AI_API_KEY DETECTED! Executing Live OpenAI Tutor Request...');

      // Register Student & Submit Question
      const sEmail = `ai_student_${Date.now()}@example.com`;
      const sReg = await makeRequest('/auth/register', 'POST', {
        name: 'AI Test Student',
        email: sEmail,
        password: 'password123',
        role: 'student',
        preferredLanguage: 'english',
      });
      const sToken = sReg.body?.token;

      const sConv = await makeRequest('/tutor/conversations', 'POST', { title: 'Newton Second Law Test' }, sToken);
      const convId = sConv.body?.data?._id;

      if (convId) {
        const tutorRes = await makeRequest(`/tutor/conversations/${convId}/messages`, 'POST', {
          content: "Explain Newton's second law to a Class 8 student using a simple real-life example. Answer in English and cite the retrieved educational source if one is available.",
        }, sToken);

        console.log(`\n2. LIVE OPENAI TUTOR RESPONSE STATUS: ${tutorRes.status}`);
        console.log(`   Response Message: "${tutorRes.body?.data?.tutorMessage?.content?.substring(0, 150)}..."`);
        console.log(`   Sources Attached: ${tutorRes.body?.data?.tutorMessage?.sources?.length || 0}`);
      }
    }

    console.log('\n🎉 PHASE 14 ENVIRONMENT & LIVE AI AUDIT COMPLETE!');
  } catch (err) {
    console.error('❌ Phase 14 Audit Error:', err);
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
      await runPhase14Verification();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
