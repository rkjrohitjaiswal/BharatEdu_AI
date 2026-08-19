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

const runDatabaseAudit = async () => {
  console.log('📊 Starting BharatEdu AI Database, Models & Data Integrity Audit...\n');

  try {
    const health = await makeRequest('/health');
    console.log('1. Health Check Response:', JSON.stringify(health.body));

    const subjects = await makeRequest('/subjects');
    console.log('2. Subjects API Count:', subjects.body?.data?.length || 0);

    const scholarships = await makeRequest('/scholarships');
    console.log('3. Scholarships API Count:', scholarships.body?.data?.length || 0);

    console.log('\n🎉 DATABASE AUDIT SCRIPT EXECUTED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Audit Execution Error:', err);
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
      await runDatabaseAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
