import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { SkeletonLoader } from '../components/SkeletonLoader';
import {
  fetchScholarships,
  fetchScholarshipAlerts,
  fetchStudentScholarshipProfile,
  saveStudentScholarshipProfile,
  saveScholarshipOpportunity,
  unsaveScholarshipOpportunity,
  updateScholarshipApplicationStatus,
} from '../services/api';
import {
  Scholarship,
  StudentScholarshipProfileData,
} from '../types';
import {
  Award,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  Save,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ScholarshipsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommended' | 'deadlines' | 'saved' | 'profile'>('recommended');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [profile, setProfile] = useState<StudentScholarshipProfileData | null>(null);

  // Profile Form state
  const [formClassLevel, setFormClassLevel] = useState<number>(8);
  const [formState, setFormState] = useState<string>('All India');
  const [formIncome, setFormIncome] = useState<string>('200000');
  const [formCategory, setFormCategory] = useState<string>('General');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    loadScholarshipData();
  }, []);

  const loadScholarshipData = async () => {
    setLoading(true);
    const [allRes, alertRes, profRes] = await Promise.all([
      fetchScholarships(),
      fetchScholarshipAlerts(),
      fetchStudentScholarshipProfile(),
    ]);

    if (allRes.success && allRes.data) setScholarships(allRes.data);
    if (alertRes.success && alertRes.data) setAlerts(alertRes.data);
    if (profRes.success && profRes.data) {
      setProfile(profRes.data);
      setFormClassLevel(profRes.data.classLevel || 8);
      setFormState(profRes.data.state || 'All India');
      setFormIncome(profRes.data.annualFamilyIncome ? String(profRes.data.annualFamilyIncome) : '200000');
      setFormCategory(profRes.data.category || 'General');
    }
    setLoading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const res = await saveStudentScholarshipProfile({
      classLevel: Number(formClassLevel),
      state: formState,
      annualFamilyIncome: Number(formIncome) || undefined,
      category: formCategory,
    });

    if (res.success && res.data) {
      setProfile(res.data);
      const updatedAlerts = await fetchScholarshipAlerts();
      if (updatedAlerts.success && updatedAlerts.data) {
        setAlerts(updatedAlerts.data);
      }
      setActiveTab('recommended');
    }
    setSavingProfile(false);
  };

  const handleToggleSave = async (scholarshipId: string, currentSaved: boolean) => {
    if (currentSaved) {
      await unsaveScholarshipOpportunity(scholarshipId);
    } else {
      await saveScholarshipOpportunity(scholarshipId);
    }
    loadScholarshipData();
  };

  const handleStatusChange = async (scholarshipId: string, status: any) => {
    await updateScholarshipApplicationStatus(scholarshipId, status);
    loadScholarshipData();
  };

  const getDeadlineBadge = (item: any) => {
    const { deadlineStatus, daysRemaining, isVerified, deadlineType } = item;

    if (deadlineType === 'rolling') {
      return <Badge variant="blue">Rolling Deadline</Badge>;
    }
    if (!isVerified || deadlineStatus === 'unknown') {
      return <Badge variant="slate">Deadline not verified</Badge>;
    }
    if (deadlineStatus === 'closed' || (daysRemaining !== null && daysRemaining <= 0)) {
      return <Badge variant="slate">Deadline Passed</Badge>;
    }
    if (daysRemaining === 0) {
      return <Badge variant="amber">Deadline Today!</Badge>;
    }
    if (daysRemaining !== null && daysRemaining <= 7) {
      return <Badge variant="amber">Urgent: {daysRemaining} days left</Badge>;
    }
    if (daysRemaining !== null && daysRemaining <= 30) {
      return <Badge variant="purple">Closing in {daysRemaining} days</Badge>;
    }
    return <Badge variant="emerald">Open Scheme</Badge>;
  };

  const getMatchBadge = (score: number) => {
    if (score >= 80) return <Badge variant="emerald">{score}% Match</Badge>;
    if (score >= 60) return <Badge variant="amber">{score}% Partial Match</Badge>;
    return <Badge variant="purple">{score}% Low Match</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <SkeletonLoader />
      </div>
    );
  }

  const savedAlerts = alerts.filter((a) => a.isSaved);
  const approachingAlerts = alerts
    .filter((a) => a.deadlineStatus === 'urgent' || a.deadlineStatus === 'closing_soon')
    .sort((a, b) => (a.daysRemaining ?? 999) - (b.daysRemaining ?? 999));

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-xs">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scholarship Intelligence & Opportunity Alerts</h1>
        <p className="text-slate-500 mt-1">
          Personalized scholarship matching, verified official deadlines, and self-reported application tracking.
        </p>
      </div>

      {/* Legal & Verified Source Disclaimer */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong className="font-bold">Official Disclaimer:</strong> BharatEdu AI provides matching guidance based on published official criteria. Final eligibility is determined strictly by the official scholarship provider.
          </p>
          <p className="text-[11px] text-amber-800 italic">
            Deadlines are shown only when verified from an official source. For unverified items: "Check the official scholarship portal."
          </p>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('recommended')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'recommended'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Recommended For You ({alerts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('deadlines')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'deadlines'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          Deadlines Approaching ({approachingAlerts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved ({savedAlerts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Scholarship Profile Setup
        </button>
      </div>

      {/* Tab 1: Recommended For You */}
      {activeTab === 'recommended' && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card className="text-center py-8 text-slate-500 text-xs">
              <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No Matching Scholarships Found</p>
              <p className="mt-1">Update your scholarship profile to see tailored recommendations.</p>
              <Button size="sm" className="mt-3" onClick={() => setActiveTab('profile')}>
                Setup Scholarship Profile
              </Button>
            </Card>
          ) : (
            alerts.map((item) => {
              const sch = item.scholarship;
              const schId = sch._id || sch.id;

              return (
                <Card key={schId} className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                          {sch.provider}
                        </span>
                        {getMatchBadge(item.matchScore)}
                        {getDeadlineBadge(item)}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{sch.name}</h3>
                    </div>

                    <button
                      onClick={() => handleToggleSave(schId, item.isSaved)}
                      className={`p-2 rounded-lg border transition-colors ${
                        item.isSaved
                          ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={item.isSaved ? 'Unsave Scholarship' : 'Save Scholarship'}
                    >
                      {item.isSaved ? <BookmarkCheck className="w-4 h-4 text-purple-700" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{sch.description}</p>

                  {/* Matched Criteria */}
                  <div className="space-y-1.5 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Matched Criteria
                    </span>
                    <p className="text-slate-700">{item.eligibilitySummary || sch.eligibilityCriteria?.join(', ')}</p>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">
                        {item.daysRemaining !== null
                          ? `Deadline: ${new Date(sch.deadline).toLocaleDateString('en-IN')}`
                          : 'Deadline not verified'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.source?.officialUrl && (
                        <a
                          href={item.source.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          <span>Apply Officially</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Deadlines Approaching */}
      {activeTab === 'deadlines' && (
        <div className="space-y-4">
          {approachingAlerts.length === 0 ? (
            <Card className="text-center py-8 text-slate-500 text-xs">
              <Clock className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No Urgent Deadlines Approaching</p>
              <p className="mt-1">All your matched scholarship opportunities have open deadlines.</p>
            </Card>
          ) : (
            approachingAlerts.map((item) => {
              const sch = item.scholarship;
              return (
                <Card key={sch._id || sch.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700 uppercase">{sch.provider}</span>
                        {getDeadlineBadge(item)}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{sch.name}</h3>
                    </div>
                    {getMatchBadge(item.matchScore)}
                  </div>

                  <p className="text-slate-600">{sch.description}</p>

                  <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                    <span className="font-bold text-amber-800">
                      {item.daysRemaining !== null ? `Expires in ${item.daysRemaining} days` : 'Check Portal'}
                    </span>
                    <a
                      href={sch.applicationUrl || 'https://scholarships.gov.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold"
                    >
                      <span>Apply Officially</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Saved Opportunities & Tracking */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedAlerts.length === 0 ? (
            <Card className="text-center py-8 text-slate-500 text-xs">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No Saved Scholarships</p>
              <p className="mt-1">Click the bookmark icon on any scholarship to save it for quick tracking.</p>
            </Card>
          ) : (
            savedAlerts.map((item) => {
              const sch = item.scholarship;
              const schId = sch._id || sch.id;

              return (
                <Card key={schId} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-700 uppercase">{sch.provider}</span>
                        {getDeadlineBadge(item)}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{sch.name}</h3>
                    </div>

                    <button
                      onClick={() => handleToggleSave(schId, true)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-purple-900">Application Tracking:</span>
                      <span className="text-[10px] text-purple-700 italic">Self-reported status</span>
                    </div>

                    <select
                      value={item.applicationStatus || 'not_started'}
                      onChange={(e) => handleStatusChange(schId, e.target.value)}
                      className="p-2 border border-purple-200 rounded-lg bg-white w-full font-medium"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="planning">Planning Documents</option>
                      <option value="applied">Applied on Portal</option>
                      <option value="submitted">Submitted & Acknowledged</option>
                      <option value="closed">Closed / Archived</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                    <span className="text-slate-500">
                      {item.daysRemaining !== null
                        ? `Deadline: ${new Date(sch.deadline).toLocaleDateString('en-IN')}`
                        : 'Deadline not verified'}
                    </span>
                    <a
                      href={sch.applicationUrl || 'https://scholarships.gov.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold"
                    >
                      <span>Apply Officially</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Tab 4: Profile Setup */}
      {activeTab === 'profile' && (
        <Card title="Scholarship Profile Setup" subtitle="Information is used strictly to match published official criteria">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class Level</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={formClassLevel}
                  onChange={(e) => setFormClassLevel(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State / Territory</label>
                <input
                  type="text"
                  value={formState}
                  onChange={(e) => setFormState(e.target.value)}
                  placeholder="e.g. Gujarat, Maharashtra, All India"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  step="10000"
                  value={formIncome}
                  onChange={(e) => setFormIncome(e.target.value)}
                  placeholder="e.g. 200000"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category (Optional)</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={savingProfile} icon={<Save className="w-4 h-4" />}>
                {savingProfile ? 'Saving Profile...' : 'Save & Update Matches'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
