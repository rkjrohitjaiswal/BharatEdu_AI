import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

interface Props {
  isAcknowledged: boolean;
  acknowledgedAt?: string;
}

export const AcknowledgementStatus: React.FC<Props> = ({ isAcknowledged, acknowledgedAt }) => {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold">
      {isAcknowledged ? (
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged {acknowledgedAt ? `(${new Date(acknowledgedAt).toLocaleDateString()})` : ''}
        </span>
      ) : (
        <span className="text-amber-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Pending Acknowledgment
        </span>
      )}
    </div>
  );
};

export default AcknowledgementStatus;
