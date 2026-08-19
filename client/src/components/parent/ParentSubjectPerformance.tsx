import React from 'react';
import { SubjectProgress } from './SubjectProgress';

interface ParentSubjectPerformanceProps {
  subjects: {
    subjectId: string;
    subjectName: string;
    masteryScore: number;
    totalTopics: number;
    masteredTopics: number;
  }[];
}

export const ParentSubjectPerformance: React.FC<ParentSubjectPerformanceProps> = ({ subjects }) => {
  return <SubjectProgress subjects={subjects} />;
};
