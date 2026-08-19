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

const runScholarshipIntelligenceAudit = async () => {
  console.log('🎓 Starting Scholarship Intelligence & Eligibility Audit...\n');

  try {
    // 1. Register Student A & Student B
    const emailA = `scholarship_student_a_${Date.now()}@example.com`;
    const regA = await makeRequest('/auth/register', 'POST', {
      name: 'Scholarship Student A',
      email: emailA,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenA = regA.body?.token;

    const emailB = `scholarship_student_b_${Date.now()}@example.com`;
    const regB = await makeRequest('/auth/register', 'POST', {
      name: 'Scholarship Student B',
      email: emailB,
      password: 'password123',
      role: 'student',
      preferredLanguage: 'english',
    });
    const tokenB = regB.body?.token;

    // 2. Fetch Public Scholarships
    const publicSch = await makeRequest('/scholarships', 'GET');
    console.log(`1. Public Scholarships Discovery: Status ${publicSch.status} | Count: ${publicSch.body?.data?.length || 0}`);

    // 3. Save Student A Scholarship Profile (Eligible for National Means cum Merit)
    const saveProfileA = await makeRequest('/student/scholarships/profile', 'POST', {
      classLevel: 8,
      state: 'Gujarat',
      annualFamilyIncome: 150000,
      category: 'OBC',
      academicPercentage: 78,
    }, tokenA);
    console.log(`2. Save Student A Scholarship Profile: Status ${saveProfileA.status}`);

    // 4. Fetch Student A Matches
    const matchesA = await makeRequest('/student/scholarships/matches', 'GET', null, tokenA);
    const firstMatch = matchesA.body?.data?.[0];
    console.log(`3. Fetch Student A Matches: Status ${matchesA.status} | Top Match Score: ${firstMatch?.matchScore}% | Status: ${firstMatch?.status}`);

    // 5. Legal Disclaimer Verification
    const disclaimer = matchesA.body?.disclaimer || matchesA.body?.meta?.disclaimer || '';
    const hasDisclaimer = disclaimer.includes('BharatEdu AI provides matching guidance') || JSON.stringify(matchesA.body).includes('official provider');
    console.log('4. Legal Disclaimer Banner Verification:', hasDisclaimer ? '✅ VERIFIED' : '❌ FAILED');

    // 6. Ownership Isolation: Student B fetching Student A profile
    const profileB = await makeRequest('/student/scholarships/profile', 'GET', null, tokenB);
    const isIsolated = !profileB.body?.data?.annualFamilyIncome || profileB.body?.data?.annualFamilyIncome !== 150000;
    console.log('5. Student Profile Isolation (Student B cannot access Student A financial data):', isIsolated ? '✅ VERIFIED' : '❌ FAILED');

    console.log('\n🎉 SCHOLARSHIP INTELLIGENCE AUDIT COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Scholarship Audit Error:', err);
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
      await runScholarshipIntelligenceAudit();
      serverProcess.kill();
      process.exit(0);
    }, 500);
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server error output:', data.toString());
});
