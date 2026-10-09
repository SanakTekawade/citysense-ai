import React, { useState } from 'react';
import { X, ArrowRightLeft, Star, MapPin, Clock, DollarSign, Accessibility, ShieldCheck, Check, Minus } from 'lucide-react';
import { PlaceItem, POPULAR_PLACES_DATA, RECOMMENDED_PLACES_DATA } from '../data/cityData';
import { PlaceArt } from './PlaceArt';

interface ComparePlacesModalProps {
  currentPlace: PlaceItem;
  isOpen: boolean;
  onClose: () => void;
  onSelectComparePlace?: (place: PlaceItem) => void;
}

export const ComparePlacesModal: React.FC<ComparePlacesModalProps> = ({
  currentPlace,
  isOpen,
  onClose,
  onSelectComparePlace,
}) => {
  const allPlaces = [...POPULAR_PLACES_DATA, ...RECOMMENDED_PLACES_DATA].filter(
    (p) => p.id !== currentPlace.id
  );

  const [compareTargetId, setCompareTargetId] = useState<string>(
    allPlaces.find((p) => p.categoryId === currentPlace.categoryId)?.id || allPlaces[0]?.id || ''
  );

  if (!isOpen) return null;

  const targetPlace = allPlaces.find((p) => p.id === compareTargetId) || allPlaces[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-black border border-white/20 rounded-[36px] p-6 sm:p-8 flex flex-col gap-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl glass-blue-btn flex items-center justify-center text-slate-950 font-bold">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white tracking-tight">Compare Venues</h3>
              <span className="text-xs text-slate-400">Side-by-side venue metrics & features</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Selector Strip */}
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Compare against:</span>
          <select
            value={compareTargetId}
            onChange={(e) => setCompareTargetId(e.target.value)}
            className="bg-black/80 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold text-white outline-none cursor-pointer w-full max-w-xs"
          >
            {allPlaces.map((p) => (
              <option key={p.id} value={p.id} className="bg-neutral-900 text-white">
                {p.name} ({p.category})
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {/* Column 1: Current Place */}
          <div className="rounded-[28px] p-5 clay-card flex flex-col gap-4">
            <div className="w-full h-36 rounded-2xl overflow-hidden relative">
              <PlaceArt iconType={currentPlace.clayIcon} themeColor={currentPlace.themeColor} />
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-[10px] font-bold text-blue-300">
                Primary Choice
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-blue-400">{currentPlace.category}</span>
              <h4 className="text-lg font-bold text-white leading-snug">{currentPlace.name}</h4>
              <span className="text-xs text-slate-400">{currentPlace.address}</span>
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Rating:</span>
                <span className="font-bold text-white">
                  {currentPlace.rating ? `${currentPlace.rating} ★ (${currentPlace.reviewsCount || 0})` : 'Rating Pending'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Pricing:</span>
                <span className="font-bold text-white">{currentPlace.price || 'Free'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Distance:</span>
                <span className="font-bold text-white">{currentPlace.distance}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Hours:</span>
                <span className="font-bold text-white truncate max-w-[150px]">{currentPlace.hours}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Step-Free Access:</span>
                <span className={`font-bold ${currentPlace.accessible ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {currentPlace.accessible ? 'Verified Yes' : 'No / Stairs'}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Target Comparison Place */}
          {targetPlace && (
            <div className="rounded-[28px] p-5 clay-card flex flex-col gap-4">
              <div className="w-full h-36 rounded-2xl overflow-hidden relative">
                <PlaceArt iconType={targetPlace.clayIcon} themeColor={targetPlace.themeColor} />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-[10px] font-bold text-slate-300">
                  Comparator
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-blue-400">{targetPlace.category}</span>
                <h4 className="text-lg font-bold text-white leading-snug">{targetPlace.name}</h4>
                <span className="text-xs text-slate-400">{targetPlace.address}</span>
              </div>

              {/* Metrics */}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Rating:</span>
                  <span className="font-bold text-white">
                    {targetPlace.rating ? `${targetPlace.rating} ★ (${targetPlace.reviewsCount || 0})` : 'Rating Pending'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Pricing:</span>
                  <span className="font-bold text-white">{targetPlace.price || 'Free'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Distance:</span>
                  <span className="font-bold text-white">{targetPlace.distance}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Hours:</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{targetPlace.hours}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Step-Free Access:</span>
                  <span className={`font-bold ${targetPlace.accessible ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {targetPlace.accessible ? 'Verified Yes' : 'No / Stairs'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectComparePlace?.(targetPlace);
                  onClose();
                }}
                className="mt-2 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Switch to this Place
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
