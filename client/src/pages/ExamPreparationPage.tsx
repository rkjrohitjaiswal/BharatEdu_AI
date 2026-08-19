import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchStudentExams, createExam, deleteExam } from '../services/api';
import { ExamCard } from '../components/exams/ExamCard';
import { ExamEmptyState } from '../components/exams/ExamEmptyState';
import { CreateExamModal } from '../components/exams/CreateExamModal';
import { Plus, GraduationCap } from 'lucide-react';

export const ExamPreparationPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [exams, setExams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    const res = await fetchStudentExams();
    if (res.success && res.data) {
      setExams(res.data);
    }
    setLoading(false);
  };

  const handleCreateExam = async (input: any) => {
    const res = await createExam(input);
    if (res.success) {
      await loadExams();
    }
  };

  const handleDeleteExam = async (id: string) => {
    const res = await deleteExam(id);
    if (res.success) {
      await loadExams();
    }
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto">
      <PageHeader
        title="Exam Preparation & Readiness"
        description="Set upcoming exam targets, evaluate weighted readiness scores, and track your daily study preparation."
        actions={
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Set New Exam Target
          </Button>
        }
      />

      {exams.length === 0 ? (
        <ExamEmptyState onOpenCreate={() => setIsModalOpen(true)} />
      ) : (
        <Card title="Upcoming & Active Exams" subtitle="Your target exam timeline">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <ExamCard key={exam._id || exam.id} exam={exam} onDelete={handleDeleteExam} />
            ))}
          </div>
        </Card>
      )}

      <CreateExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateExam}
      />
    </div>
  );
};
