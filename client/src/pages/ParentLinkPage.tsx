import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import {
  generateParentInvitation,
  fetchStudentInvitations,
  revokeParentInvitation,
  acceptParentInvitation,
} from '../services/api';
import { Users, Key, Clock, ShieldCheck, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const ParentLinkPage: React.FC<{ user: any }> = ({ user }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [newCodeData, setNewCodeData] = useState<any>(null);
  const [relationship, setRelationship] = useState<string>('guardian');
  const [acceptCode, setAcceptCode] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isParent = user?.role === 'parent';

  useEffect(() => {
    if (!isParent) {
      loadInvitations();
    }
  }, [user]);

  const loadInvitations = async () => {
    const res = await fetchStudentInvitations();
    if (res.success && res.data) {
      setInvitations(res.data);
    }
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    setStatusMsg(null);
    const res = await generateParentInvitation(relationship);
    if (res.success && res.data) {
      setNewCodeData(res.data);
      setStatusMsg({ type: 'success', text: 'Parent invitation code generated successfully!' });
      await loadInvitations();
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Failed to generate invitation code.' });
    }
    setLoading(false);
  };

  const handleRevokeCode = async (code: string) => {
    const res = await revokeParentInvitation(code);
    if (res.success) {
      setStatusMsg({ type: 'success', text: `Invitation code ${code} revoked.` });
      await loadInvitations();
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Failed to revoke code.' });
    }
  };

  const handleAcceptCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptCode.trim()) return;

    setLoading(true);
    setStatusMsg(null);
    const res = await acceptParentInvitation(acceptCode.trim());
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message || 'Student linked successfully!' });
      setAcceptCode('');
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Failed to link student.' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl mx-auto">
      <PageHeader
        title={isParent ? 'Link a Student Account' : 'Parent / Guardian Access'}
        description={
          isParent
            ? 'Enter the invitation code provided by your child to link their student account.'
            : 'Generate a secure invitation code to allow your parent or guardian to view your learning progress.'
        }
      />

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Parent Accept Form */}
      {isParent ? (
        <Card title="Enter Invitation Code" subtitle="Short-lived single-use code from your child">
          <form onSubmit={handleAcceptCode} className="space-y-4 max-w-md">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Invitation Code</label>
              <input
                type="text"
                placeholder="e.g. LINK-9X4K2"
                value={acceptCode}
                onChange={(e) => setAcceptCode(e.target.value.toUpperCase())}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-bold tracking-widest text-purple-950 uppercase focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <Button type="submit" disabled={loading} icon={<Key className="w-4 h-4" />}>
              {loading ? 'Verifying...' : 'Link Student Account'}
            </Button>
          </form>
        </Card>
      ) : (
        /* Student Invitation Generation Section */
        <div className="space-y-6">
          <Card title="Generate Parent Invitation" subtitle="Allows parent to view progress reports">
            <div className="space-y-4 max-w-lg">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-500"
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Button onClick={handleGenerateCode} disabled={loading} icon={<Key className="w-4 h-4" />}>
                {loading ? 'Generating...' : 'Generate 15-Min Invitation Code'}
              </Button>

              {/* Newly Generated Code Display */}
              {newCodeData && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                    YOUR INVITATION CODE
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-purple-950 tracking-widest">
                    {newCodeData.code}
                  </div>
                  <p className="text-purple-800 text-[11px] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    Valid for 15 minutes. Share this code with your parent.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Privacy Guarantee Banner */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-emerald-950">
              <h4 className="font-bold">Privacy Protection Guarantee</h4>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Linking a parent grants access ONLY to high-level progress summaries, mastery trends, and study tasks.
                Your private AI tutor chats, raw question answers, and teacher notes are NEVER shared.
              </p>
            </div>
          </div>

          {/* Active Invitations List */}
          <Card title="Active Invitations" subtitle="Current linking codes generated for your account">
            <div className="space-y-2">
              {invitations.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No active parent invitations.</p>
              ) : (
                invitations.map((inv) => (
                  <div
                    key={inv._id || inv.code}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-purple-950">{inv.code || inv.invitationCode}</span>
                      <Badge variant={inv.status === 'active' ? 'emerald' : inv.status === 'revoked' ? 'slate' : 'amber'}>
                        {inv.status}
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevokeCode(inv.code || inv.invitationCode)}
                      icon={<Trash2 className="w-3 h-3 text-red-500" />}
                    >
                      Revoke
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
