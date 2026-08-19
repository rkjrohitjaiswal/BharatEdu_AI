import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, MessageCircle, Plus, Target, Trash2, TrendingUp } from 'lucide-react';
import { createCareerGoal, deleteCareerGoal, fetchCareerAdvice, fetchCareerCatalog, fetchCareerGoals, fetchCareerRoadmap } from '../services/careerApi';

export const CareerRoadmapPage: React.FC = () => {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [advice, setAdvice] = useState('');
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [c, g] = await Promise.all([fetchCareerCatalog(), fetchCareerGoals()]);
      setCatalog(c.data || []); setGoals(g.data || []);
      if (g.data?.[0]) setSelected((await fetchCareerRoadmap(g.data[0]._id)).data);
    } catch (e: any) { setError(e.message || 'Unable to load career roadmap'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const addGoal = async (role: string) => { setBusy(true); setError(''); try { await createCareerGoal(role); await load(); } catch (e: any) { setError(e.message || 'Unable to create career goal'); } finally { setBusy(false); } };
  const removeGoal = async (id: string) => { setBusy(true); try { await deleteCareerGoal(id); setSelected(null); setAdvice(''); await load(); } catch (e: any) { setError(e.message || 'Unable to remove goal'); } finally { setBusy(false); } };
  const loadAdvice = async () => { if (!selected?.goal?._id) return; setBusy(true); try { const result = await fetchCareerAdvice(selected.goal._id); setAdvice(result.data.advice); setAiEnhanced(Boolean(result.data.aiEnhanced)); } catch (e: any) { setError(e.message || 'Unable to generate career advice'); } finally { setBusy(false); } };

  if (loading) return <div className="p-8 text-slate-500">Loading your career roadmap…</div>;
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
    <header><div className="flex items-center gap-3"><Briefcase className="text-emerald-600" /><h1 className="text-3xl font-bold text-slate-900">AI Career & Skill Roadmap</h1></div><p className="mt-2 text-slate-600">Turn your learning evidence into a practical path toward your target career.</p></header>
    {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}
    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{catalog.map(career => <button key={career.id} disabled={busy} onClick={() => addGoal(career.id)} className="text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-emerald-400 hover:shadow-sm transition"><Target className="text-emerald-600 mb-3" /><h2 className="font-semibold text-slate-900">{career.title}</h2><p className="mt-2 text-sm text-slate-500">{career.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm text-emerald-700"><Plus size={15}/> Set as goal</span></button>)}</section>
    {goals.length > 0 && <section className="grid lg:grid-cols-[280px_1fr] gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2"><h3 className="font-semibold mb-3">My career goals</h3>{goals.map(g => <div key={g._id} className="flex items-center gap-2"><button onClick={async () => { setSelected((await fetchCareerRoadmap(g._id)).data); setAdvice(''); }} className="flex-1 text-left rounded-lg p-3 hover:bg-slate-50"><div className="font-medium">{catalog.find(c => c.id === g.targetRole)?.title || g.targetRole}</div><div className="text-xs text-slate-500">{g.status}</div></button><button title="Delete" onClick={() => removeGoal(g._id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button></div>)}</div>
      {selected && <div className="space-y-6">
        <div className="rounded-2xl bg-slate-900 text-white p-6"><div className="text-sm text-emerald-300">Career readiness</div><div className="flex items-end gap-3 mt-1"><span className="text-5xl font-bold">{selected.readiness}%</span><TrendingUp className="mb-2 text-emerald-300"/></div><p className="mt-2 text-slate-300">Deterministic score calculated from your existing learning mastery.</p><button disabled={busy} onClick={loadAdvice} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white text-slate-900 px-4 py-2 font-medium"><MessageCircle size={16}/> Get AI career guidance</button></div>
        {advice && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{aiEnhanced ? 'AI-enhanced guidance' : 'Offline guidance'}</div><p className="mt-2 text-slate-700 whitespace-pre-wrap">{advice}</p></div>}
        <div className="grid md:grid-cols-2 gap-4">{selected.skills.map((skill: any) => <div key={skill.name} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex justify-between gap-3"><div><h3 className="font-semibold">{skill.name}</h3><p className="text-sm text-slate-500 mt-1">{skill.description}</p></div><span className="text-sm font-semibold">{skill.score}%</span></div><div className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${skill.score}%`}}/></div><div className="mt-3 text-xs uppercase tracking-wide text-slate-500">{skill.level.replace('_',' ')} · {skill.priority} priority</div></div>)}</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">Personalized roadmap</h2><div className="mt-5 space-y-4">{selected.stages.length ? selected.stages.map((stage: any) => <div key={stage.order} className="flex gap-4"><div className="w-9 h-9 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">{stage.order}</div><div className="flex-1"><div className="flex justify-between"><h3 className="font-semibold">{stage.skill}</h3><span className="text-xs text-slate-500">{stage.priority}</span></div><p className="text-sm text-slate-600 mt-1">{stage.objective}</p><div className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-700"><CheckCircle2 size={15}/> Project: {stage.project}</div></div></div>) : <p className="text-slate-500">You are strong across the current skill map. Keep practicing to maintain readiness.</p>}</div></div>
      </div>}
    </section>}
    {goals.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Choose a career above to create your first personalized roadmap.</div>}
  </div>;
};
export default CareerRoadmapPage;
