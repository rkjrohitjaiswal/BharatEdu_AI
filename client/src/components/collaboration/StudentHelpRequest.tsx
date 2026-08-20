import React from 'react';
import { HelpCircle } from 'lucide-react';

interface Props {
  onRequest: () => void;
}

export const StudentHelpRequest: React.FC<Props> = ({ onRequest }) => {
  return (
    <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 font-bold text-purple-300">
        <HelpCircle className="w-4 h-4 text-purple-400" /> Need extra help from teacher?
      </div>
      <button
        onClick={onRequest}
        className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-[10px]"
      >
        Request Help
      </button>
    </div>
  );
};

export default StudentHelpRequest;
