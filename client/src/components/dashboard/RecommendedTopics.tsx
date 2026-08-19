import React from 'react';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Topic } from '../../types';
import { Compass, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecommendedTopicsProps {
  topics: Topic[];
}

export const RecommendedTopics: React.FC<RecommendedTopicsProps> = ({ topics }) => {
  return (
    <Card title="What Should I Learn Next?" subtitle="Recommended learning path topics">
      {topics.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 space-y-2">
          <Compass className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No Recommendations Yet</p>
          <p className="text-slate-400">Complete a few learning activities to receive personalized recommendations.</p>
          <div className="pt-2">
            <Link to="/practice">
              <Button size="sm" variant="outline">Browse All Topics</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {topics.map((topic) => {
            const subjectName =
              typeof topic.subjectId === 'object' && topic.subjectId !== null
                ? topic.subjectId.name
                : 'Core Curriculum';

            return (
              <div
                key={topic._id}
                className="p-4 border border-slate-200 rounded-xl hover:border-emerald-500 bg-white shadow-sm flex flex-col justify-between gap-3 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {subjectName}
                    </span>
                    <Badge variant="slate" size="sm">
                      {topic.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{topic.name}</h4>
                  <p className="text-slate-500 line-clamp-2">{topic.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{topic.estimatedLearningMinutes} mins</span>
                  </span>
                  <Link to="/practice">
                    <Button size="sm" variant="ghost" icon={<ChevronRight className="w-3.5 h-3.5" />}>
                      Start Lesson
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
