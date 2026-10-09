import React from 'react';
import { X, MapPin, Clock, Star, Share2, Bookmark, Check, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { PlaceItem } from '../data/cityData';
import { PlaceArt } from './PlaceArt';

interface PlaceDetailModalProps {
  place: PlaceItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-black border border-white/20 rounded-[36px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header / Image Area */}
        <div className="relative w-full h-56 sm:h-64 bg-slate-900 overflow-hidden">
          <PlaceArt iconType={place.clayIcon} themeColor={place.themeColor} className="h-full rounded-none" />

          {/* Close button in liquid glass circle */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/25 flex items-center justify-center text-white transition-all cursor-pointer z-10"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Chip */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-semibold text-blue-300 backdrop-blur-md">
            {place.category}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Title & Rating */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                {place.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{place.address}</span>
                <span>·</span>
                <span>{place.distance}</span>
              </div>
            </div>

            {/* Rating display ONLY when available */}
            {typeof place.rating === 'number' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold text-sm shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{place.rating.toFixed(1)}</span>
                {place.reviewsCount ? (
                  <span className="text-xs text-slate-400 font-normal">
                    ({place.reviewsCount.toLocaleString()})
                  </span>
                ) : null}
              </div>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-400 border border-white/10 shrink-0">
                {place.statusLabel || 'Rating Pending'}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {place.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex flex-col text-xs">
                <span className="text-slate-400">Operating Hours</span>
                <span className="font-semibold text-white">{place.hours}</span>
              </div>
            </div>

            {place.price && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex flex-col text-xs">
                  <span className="text-slate-400">Pricing / Entry</span>
                  <span className="font-semibold text-white">{place.price}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => onToggleBookmark(place.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-400 text-blue-400' : ''}`} />
              <span>{isBookmarked ? 'Saved to Favorites' : 'Save Place'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-slate-950 glass-blue-btn transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Explore Routes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
