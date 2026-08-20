import React from 'react';
import { ICollaborationThreadClient } from '../../types/collaboration';
import { CollaborationThreadCard } from './CollaborationThreadCard';

interface Props {
  threads: ICollaborationThreadClient[];
  selectedThreadId: string;
  onSelectThread: (id: string) => void;
}

export const CollaborationThreadList: React.FC<Props> = ({ threads, selectedThreadId, onSelectThread }) => {
  return (
    <div className="space-y-3">
      {threads.map((t) => (
        <CollaborationThreadCard
          key={t.threadId}
          thread={t}
          isSelected={t.threadId === selectedThreadId}
          onClick={() => onSelectThread(t.threadId)}
        />
      ))}
    </div>
  );
};

export default CollaborationThreadList;
