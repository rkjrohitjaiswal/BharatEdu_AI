import React, { useEffect, useState } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { fetchClassroomTeacherClasses, fetchClassroomOverview } from '../services/api';
import { IClassroomIntelligenceClient } from '../types/classroom-intelligence';

import { ClassroomOverview } from '../components/classroom-intelligence/ClassroomOverview';
import { ClassPerformanceCards } from '../components/classroom-intelligence/ClassPerformanceCards';
import { StudentRiskDistribution } from '../components/classroom-intelligence/StudentRiskDistribution';
import { MasteryDistribution } from '../components/classroom-intelligence/MasteryDistribution';
import { SubjectPerformance } from '../components/classroom-intelligence/SubjectPerformance';
import { TopicPerformance } from '../components/classroom-intelligence/TopicPerformance';
import { ClassLearningGaps } from '../components/classroom-intelligence/ClassLearningGaps';
import { ClassMisconceptions } from '../components/classroom-intelligence/ClassMisconceptions';
import { LearningVelocityChart } from '../components/classroom-intelligence/LearningVelocityChart';
import { EngagementSummary } from '../components/classroom-intelligence/EngagementSummary';
import { AssessmentPerformance } from '../components/classroom-intelligence/AssessmentPerformance';
import { QuestionQualityAlerts } from '../components/classroom-intelligence/QuestionQualityAlerts';
import { InterventionQueue } from '../components/classroom-intelligence/InterventionQueue';
import { InterventionEffectiveness } from '../components/classroom-intelligence/InterventionEffectiveness';
import { TeacherActionPlan } from '../components/classroom-intelligence/TeacherActionPlan';
import { ClassroomAIInsight } from '../components/classroom-intelligence/ClassroomAIInsight';
import { StudentAttentionList } from '../components/classroom-intelligence/StudentAttentionList';
import { ClassComparison } from '../components/classroom-intelligence/ClassComparison';
import { ClassroomEmptyState } from '../components/classroom-intelligence/ClassroomEmptyState';

export const TeacherClassroomIntelligencePage: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [data, setData] = useState<IClassroomIntelligenceClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    const res = await fetchClassroomTeacherClasses();
    if (res.success && res.data && res.data.length > 0) {
      setClasses(res.data);
      const firstId = res.data[0].classId;
      setSelectedClassId(firstId);
      loadClassData(firstId);
    } else {
      setLoading(false);
    }
  };

  const loadClassData = async (classId: string) => {
    setLoading(true);
    const res = await fetchClassroomOverview(classId);
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedClassId(id);
    loadClassData(id);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading AI Classroom Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
        <ClassroomEmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Class Selector Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Select Classroom</div>
              <select
                value={selectedClassId}
                onChange={handleClassChange}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-purple-500 mt-0.5"
              >
                {classes.map((c) => (
                  <option key={c.classId} value={c.classId}>
                    {c.className} ({c.subject})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => loadClassData(selectedClassId)}
            className="py-2 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Classroom Header Overview */}
        <ClassroomOverview data={data} />

        {/* AI Insight Layer */}
        <ClassroomAIInsight insight={data.aiInsight} />

        {/* Performance Cards */}
        <ClassPerformanceCards performance={data.performance} />

        {/* Teacher Action Plan & Intervention Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeacherActionPlan plan={data.actionPlan} />
          <InterventionQueue interventions={data.suggestedInterventions} onRefresh={() => loadClassData(selectedClassId)} />
        </div>

        {/* Student Attention & Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentAttentionList students={data.studentProfiles} />
          <StudentRiskDistribution distribution={data.riskDistribution} />
        </div>

        {/* Mastery Distribution & Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MasteryDistribution distribution={data.masteryDistribution} />
          <SubjectPerformance subjects={data.subjects} />
        </div>

        {/* Topic Analytics & Learning Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopicPerformance topics={data.topics} />
          <ClassLearningGaps gaps={data.gaps} />
        </div>

        {/* Misconceptions & Assessment Quality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClassMisconceptions misconceptions={data.misconceptions} />
          <div className="space-y-6">
            <AssessmentPerformance distribution={data.assessmentDistribution} averageScore={data.performance.averageAssessmentScore} />
            <QuestionQualityAlerts />
          </div>
        </div>

        {/* Velocity, Engagement & Effectiveness */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LearningVelocityChart performance={data.performance} />
          <EngagementSummary performance={data.performance} />
          <InterventionEffectiveness />
        </div>

        {/* Class Comparison */}
        <ClassComparison />
      </div>
    </div>
  );
};

export default TeacherClassroomIntelligencePage;
