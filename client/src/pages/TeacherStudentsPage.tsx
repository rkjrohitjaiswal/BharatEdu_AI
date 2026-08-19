import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Users, Search, Filter, AlertCircle } from 'lucide-react';

export const TeacherStudentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Students Roster"
        description="Monitor individual student engagement, learning gaps, and early intervention status."
        badge={<Badge variant="purple">Class 8-A</Badge>}
      />

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student by name or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" icon={<Filter className="w-3.5 h-3.5" />}>
              Filter Status
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Grade / Stream</th>
                <th className="py-3 px-4">Mastery Score</th>
                <th className="py-3 px-4">Intervention Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Aarav Sharma</td>
                <td className="py-3 px-4">Grade 8 • Science</td>
                <td className="py-3 px-4 font-mono text-emerald-600 font-bold">88%</td>
                <td className="py-3 px-4">
                  <Badge variant="emerald" size="sm">On Track</Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-emerald-700 font-semibold hover:underline">View Profile</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Priya Verma</td>
                <td className="py-3 px-4">Grade 8 • Science</td>
                <td className="py-3 px-4 font-mono text-amber-600 font-bold">54%</td>
                <td className="py-3 px-4">
                  <Badge variant="amber" size="sm">Needs Review</Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-emerald-700 font-semibold hover:underline">View Profile</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Rahul Kumar</td>
                <td className="py-3 px-4">Grade 8 • Science</td>
                <td className="py-3 px-4 font-mono text-emerald-600 font-bold">92%</td>
                <td className="py-3 px-4">
                  <Badge variant="emerald" size="sm">On Track</Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-emerald-700 font-semibold hover:underline">View Profile</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
