import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchResourceById, startResource, completeResource, saveResource, submitResourceFeedback } from '../services/api';
import { ILearningResourceClient } from '../types/resource-recommendation';
import { ResourceDetails } from '../components/resources/ResourceDetails';
import { ResourceFeedback } from '../components/resources/ResourceFeedback';
import { ArrowLeft } from 'lucide-react';

export const ResourceDetailPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [resource, setResource] = useState<ILearningResourceClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (resourceId) loadResource(resourceId);
  }, [resourceId]);

  const loadResource = async (id: string) => {
    setLoading(true);
    const res = await fetchResourceById(id);
    if (res.success && res.data) {
      setResource(res.data);
    }
    setLoading(false);
  };

  const handleStart = async () => {
    if (!resourceId) return;
    await startResource(resourceId);
    setStatusMessage('Started learning resource session.');
  };

  const handleComplete = async () => {
    if (!resourceId) return;
    await completeResource(resourceId, 900);
    setStatusMessage('Resource marked completed! Great job!');
  };

  const handleSave = async () => {
    if (!resourceId) return;
    await saveResource(resourceId);
    setStatusMessage('Resource saved to your bookmarks.');
  };

  const handleFeedback = async (type: string, comment?: string) => {
    if (!resourceId) return;
    await submitResourceFeedback(resourceId, type, comment);
    setStatusMessage(`Thank you for your feedback! (${type})`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading Resource Details...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 text-center space-y-4">
        <h2 className="text-xl font-bold">Resource Not Found</h2>
        <Link to="/resources" className="text-purple-400 font-bold hover:underline">
          ← Return to Resources
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/resources" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Resource Catalog
        </Link>

        {statusMessage && (
          <div className="p-3 bg-purple-950/40 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-semibold">
            {statusMessage}
          </div>
        )}

        <ResourceDetails
          resource={resource}
          onStart={handleStart}
          onComplete={handleComplete}
          onSave={handleSave}
          onFeedback={(type) => handleFeedback(type)}
        />

        <ResourceFeedback onSubmit={(type, comment) => handleFeedback(type, comment)} />
      </div>
    </div>
  );
};

export default ResourceDetailPage;
