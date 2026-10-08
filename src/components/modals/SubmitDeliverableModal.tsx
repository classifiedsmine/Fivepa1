import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, UploadCloud, FileText, Link, ShieldCheck } from 'lucide-react';
import { Milestone } from '../../types';

interface SubmitDeliverableModalProps {
  isOpen: boolean;
  contractId: string;
  milestone: Milestone;
  onClose: () => void;
  onSubmitted: (milestone: any) => void;
}

export const SubmitDeliverableModal: React.FC<SubmitDeliverableModalProps> = ({
  isOpen,
  contractId,
  milestone,
  onClose,
  onSubmitted,
}) => {
  const { currentUser, fetchWithAuth } = useAuth();
  const { success, error } = useToast();

  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('project-deliverable-release-v1.zip');
  const [fileSize, setFileSize] = useState('14.2 MB');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      error('Notes required', 'Please provide notes summarizing your deliverable work.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth(`/api/contracts/${contractId}/milestones/${milestone.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: currentUser.id,
          notes,
          files: [{ name: fileName, size: fileSize, url: '#' }],
        }),
      });

      const data = await res.json();
      if (data.milestone) {
        success('Deliverable Submitted!', `The client has been notified to review "${milestone.title}".`);
        onSubmitted(data.milestone);
        onClose();
      } else {
        error('Submission failed', data.error || 'Server error');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Submit Milestone Deliverable</h2>
              <p className="text-xs text-slate-300">{milestone.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Deliverable Summary & Release Notes
            </label>
            <textarea
              required
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail what has been implemented, how to run/test the files, URLs, and handover instructions..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Deliverable Attachment / Package File
            </label>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
              <FileText className="w-6 h-6 text-emerald-600" />
              <div className="flex-1">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full text-xs font-medium bg-white px-2 py-1 border border-slate-300 rounded"
                />
              </div>
              <span className="text-xs text-slate-500 font-mono">{fileSize}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              When the client clicks <strong>Accept Deliverable</strong>, the funds ($
              {(milestone.amount * 0.9).toFixed(2)} net) transition into the 14-day escrow protection period and are automatically credited to your available balance upon completion.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Deliverables for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
