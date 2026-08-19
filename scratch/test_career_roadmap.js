const base = process.env.API_BASE_URL || 'http://localhost:5000/api';
const token = process.env.STUDENT_TOKEN;

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

(async () => {
  if (!token) {
    console.log('CAREER ROADMAP TEST: SKIPPED (set STUDENT_TOKEN to run against a live server)');
    process.exit(0);
  }
  const catalog = await request('/student/career/catalog');
  if (catalog.status !== 200 || !catalog.body?.data?.length) throw new Error('Career catalog failed');
  const role = catalog.body.data[0].id;
  const goal = await request('/student/career/goals', { method: 'POST', body: JSON.stringify({ targetRole: role }) });
  if (goal.status !== 201) throw new Error('Career goal creation failed');
  const id = goal.body.data._id;
  const roadmap = await request(`/student/career/goals/${id}/roadmap`);
  if (roadmap.status !== 200 || typeof roadmap.body?.data?.readiness !== 'number') throw new Error('Roadmap calculation failed');
  if (roadmap.body.data.readiness < 0 || roadmap.body.data.readiness > 100) throw new Error('Readiness bounds failed');
  const advice = await request(`/student/career/goals/${id}/advice`);
  if (advice.status !== 200 || typeof advice.body?.data?.advice !== 'string') throw new Error('AI/fallback advice failed');
  console.log('CAREER ROADMAP TEST: PASS');
})();
