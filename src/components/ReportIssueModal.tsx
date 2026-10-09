import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Lightbulb, Bell, CheckCircle2, Send, MapPin } from 'lucide-react';
import { SafetyIncidentItem } from '../data/cityData';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newReport: Omit<SafetyIncidentItem, 'id' | 'timeAgo' | 'date' | 'upvotes'>) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Accident Reports' | 'Road Hazards' | 'Street Lighting' | 'Community Alerts'>('Road Hazards');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'high' | 'medium' | 'low' | 'advisory'>('medium');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    let categoryId: 'accident' | 'hazard' | 'lighting' | 'alert' = 'hazard';
    if (category === 'Accident Reports') categoryId = 'accident';
    else if (category === 'Street Lighting') categoryId = 'lighting';
    else if (category === 'Community Alerts') categoryId = 'alert';

    onSubmitReport({
      title,
      category,
      categoryId,
      location,
      lat: 37.7815 + (Math.random() - 0.5) * 0.02,
      lng: -122.4125 + (Math.random() - 0.5) * 0.02,
      source: 'Citizen Community Report (Pending Verification)',
      isVerified: false, // Community reports start unverified
      severity,
      description: description.trim() || 'Community reported advisory awaiting civic verification.',
      status: 'Active Alert',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setTitle('');
      setLocation('');
      setDescription('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-black border border-white/20 rounded-[36px] p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl glass-blue-btn flex items-center justify-center text-slate-950 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-white tracking-tight">Report a Safety Issue</h3>
              <span className="text-xs text-slate-400">Contribute citizen alerts to CitySense network</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 flex flex-col items-center justify-center text-center gap-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Report Submitted</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Thank you for keeping your city aware. Your report is now live as an unverified community alert pending municipal confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Issue Category</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Road Hazards' as const, icon: AlertTriangle },
                  { name: 'Street Lighting' as const, icon: Lightbulb },
                  { name: 'Accident Reports' as const, icon: ShieldAlert },
                  { name: 'Community Alerts' as const, icon: Bell },
                ].map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`py-2 px-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        category === cat.name
                          ? 'glass-blue-btn text-slate-950 shadow-md'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Brief Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken pavement, dark street lamps, traffic spill"
                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Location input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Location / Intersection</label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Market St & 4th Ave"
                  className="w-full h-11 pl-9 pr-4 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Details & Notes</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current status, lane obstructions, or helpful bypass tips..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>

            {/* Notice */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 leading-snug">
              Notice: Community submissions are marked as unverified until cross-checked by city coordinators. For acute emergencies, always call emergency services (911).
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-bold text-slate-950 glass-blue-btn flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
