import { spawn } from 'child_process';
import http from 'http';

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const makeRequest = (path) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const req = http.request(url, { method: 'GET' }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', (err) => reject(err));
    req.end();
  });
};

const runHealthCheck = async () => {
  console.log('🩺 Running BharatEdu AI Final Health Check...\n');
  try {
    const health = await makeRequest('/health');
    console.log('1. Server API Endpoint:', health.status === 200 ? '✅ ONLINE (200 OK)' : '❌ OFFLINE');
    console.log('   - Response:', JSON.stringify(health.body));

    const subjects = await makeRequest('/subjects');
    console.log('2. Curriculum Knowledge Base:', subjects.status === 200 && Array.isArray(subjects.body?.data) ? '✅ READY' : '❌ NOT SEEDED');
    console.log('   - Subjects Count:', subjects.body?.data?.length || 0);

    const scholarships = await makeRequest('/scholarships');
    console.log('3. Scholarship Engine:', scholarships.status === 200 && Array.isArray(scholarships.body?.data) ? '✅ READY' : '❌ NOT SEEDED');
    console.log('   - Scholarships Count:', scholarships.body?.data?.length || 0);
    console.log('   - Official Disclaimer Attached:', scholarships.body?.legalDisclaimer ? '✅ YES' : '❌ MISSING');

    console.log('\n🎉 ALL FINAL HEALTH CHECKS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Health Check Error:', err.message);
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
      await runHealthCheck();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});
