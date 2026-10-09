import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Accessibility,
  Bookmark,
  Share2,
  Navigation,
  ArrowRightLeft,
  Building,
  Train,
  Bus,
  Bike,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  PlaceItem,
  POPULAR_PLACES_DATA,
  RECOMMENDED_PLACES_DATA,
  SAFETY_INCIDENTS_DATA,
} from '../data/cityData';
import { PlaceArt } from './PlaceArt';
import { PlaceMiniMap } from './PlaceMiniMap';
import { ComparePlacesModal } from './ComparePlacesModal';

interface PlaceDetailsPageProps {
  place: PlaceItem;
  onBack: () => void;
  onSelectPlace: (place: PlaceItem) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onNavigateToMap: (placeId: string) => void;
}

export const PlaceDetailsPage: React.FC<PlaceDetailsPageProps> = ({
  place,
  onBack,
  onSelectPlace,
  isBookmarked,
  onToggleBookmark,
  onNavigateToMap,
}) => {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [nearbyFilter, setNearbyFilter] = useState<'all' | 'food' | 'hotels' | 'attractions'>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  // All other places for nearby suggestions
  const allPlaces = [...POPULAR_PLACES_DATA, ...RECOMMENDED_PLACES_DATA].filter(
    (p) => p.id !== place.id
  );

  const nearbyPlaces = allPlaces.filter((p) => {
    if (nearbyFilter === 'all') return true;
    return p.categoryId === nearbyFilter;
  });

  // Find any active safety advisories near this venue
  const nearbyAdvisories = SAFETY_INCIDENTS_DATA.filter(
    (inc) =>
      Math.abs(inc.lat - place.lat) < 0.02 && Math.abs(inc.lng - place.lng) < 0.02
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-24 max-w-6xl mx-auto animate-fadeIn">
      {/* Top Navigation Bar: Back button, Category Breadcrumb, Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Copy share link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Save / Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(place.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isBookmarked
                ? 'glass-blue-btn text-slate-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-slate-950' : ''}`} />
            <span>{isBookmarked ? 'Saved to Favorites' : 'Save Place'}</span>
          </button>

          {/* Compare Button */}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer shadow-md"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {copiedLink && (
        <div className="fixed top-20 right-8 z-50 p-3 rounded-2xl glass-blue-btn text-slate-950 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* =========================================================================
          HERO BANNER: Large Image & Title Area
          ========================================================================= */}
      <section className="relative w-full rounded-[40px] overflow-hidden bg-black border border-white/15 shadow-2xl">
        <div className="relative w-full h-72 sm:h-96 md:h-[420px] bg-slate-950 overflow-hidden">
          <PlaceArt iconType={place.clayIcon} themeColor={place.themeColor} className="h-full rounded-none" />

          {/* Gradient Scrim for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Category Chip & Distance */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-300 shadow-lg">
              {place.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-300">
              {place.distance}
            </span>
          </div>

          {/* Hero Place Title and Quick Meta at bottom */}
          <div className="absolute bottom-6 inset-x-6 sm:inset-x-8 flex flex-col gap-2 z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {place.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{place.address}</span>
              </span>

              {/* Rating when available */}
              <span>·</span>
              {typeof place.rating === 'number' ? (
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{place.rating.toFixed(1)}</span>
                  {place.reviewsCount ? (
                    <span className="text-xs text-slate-400 font-normal">
                      ({place.reviewsCount.toLocaleString()} reviews)
                    </span>
                  ) : null}
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  {place.statusLabel || 'Rating Pending'}
                </span>
              )}

              {/* Price when available */}
              {place.price && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                    {place.price}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN TWO-COLUMN DETAILS GRID:
          Left: Core Overview, History, Accessibility, Reviews
          Right: Interactive Map Marker, Operating Hours, Transit, Actions
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* 1. Description */}
          <div className="rounded-[32px] p-6 sm:p-7 clay-card flex flex-col gap-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Overview & Atmosphere
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {place.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {place.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Historical Information (where relevant) */}
          <div className="rounded-[32px] p-6 sm:p-7 clay-card flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Historical Background & Heritage</span>
            </div>

            {place.historicalBackground ? (
              <p className="text-sm text-slate-300 leading-relaxed">
                {place.historicalBackground}
              </p>
            ) : (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  No archival historical records on file for this newly constructed or modernized venue.
                </span>
              </div>
            )}
          </div>

          {/* 3. Accessibility Details & Safety Reports */}
          <div className="rounded-[32px] p-6 sm:p-7 clay-card flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-emerald-400" />
                <span>Accessibility & Physical Accommodations</span>
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  place.accessible
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {place.accessible ? 'Step-Free Verified' : 'Limited Step Access'}
              </span>
            </div>

            {place.accessibilityDetails ? (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 text-center">
                    <span className="text-slate-400 text-[11px]">Step-Free</span>
                    <span className="font-bold text-white">
                      {place.accessibilityDetails.stepFree ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 text-center">
                    <span className="text-slate-400 text-[11px]">Elevators</span>
                    <span className="font-bold text-white">
                      {place.accessibilityDetails.elevator ? 'Available' : 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 text-center">
                    <span className="text-slate-400 text-[11px]">Tactile / Braille</span>
                    <span className="font-bold text-white">
                      {place.accessibilityDetails.tactileSignage ? 'Installed' : 'None'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 text-center">
                    <span className="text-slate-400 text-[11px]">Sensory Quiet</span>
                    <span className="font-bold text-white">
                      {place.accessibilityDetails.sensoryQuiet ? 'Dedicated Hours' : 'Standard'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {place.accessibilityDetails.notes}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Detailed accessibility audit is currently underway for this location.
              </p>
            )}

            {/* District Safety Status */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Sector Safety & Advisory Status</span>
              </span>

              {nearbyAdvisories.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {nearbyAdvisories.map((adv) => (
                    <div
                      key={adv.id}
                      className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-bold">{adv.title}</span>
                        <span>{adv.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {place.districtSafetyNotice ||
                      'Zero active road hazards or incidents reported within 500 meters of this venue.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Rating & Reviews Section */}
          <div className="rounded-[32px] p-6 sm:p-7 clay-card flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Community Ratings & Reviews</span>
              </span>

              {typeof place.rating === 'number' && (
                <div className="flex items-center gap-1 font-bold text-amber-300 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{place.rating.toFixed(1)} / 5.0</span>
                </div>
              )}
            </div>

            {place.reviews && place.reviews.length > 0 ? (
              <div className="flex flex-col gap-3">
                {place.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rev.author}</span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-amber-300 font-bold">{rev.rating} ★</span>
                        <span>·</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center gap-2">
                <Star className="w-8 h-8 text-slate-500" />
                <h4 className="text-sm font-bold text-white">No Public Reviews Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  This venue is newly listed or operates without commercial review aggregators. Verified visits can be logged via CitySense community alerts.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
          {/* Mini Interactive Map with Marker */}
          <div className="rounded-[32px] p-5 clay-card flex flex-col gap-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Interactive Location Pin</span>
              </span>

              <button
                onClick={() => onNavigateToMap(place.id)}
                className="text-xs font-semibold text-blue-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Full City Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <PlaceMiniMap place={place} className="h-56" />

            <div className="text-xs text-slate-300 flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="truncate">{place.address}</span>
            </div>
          </div>

          {/* Operating Hours & Price Range Card */}
          <div className="rounded-[32px] p-6 clay-card flex flex-col gap-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Visiting Details
            </span>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-slate-400">Opening Hours</span>
                  <span className="font-bold text-white">{place.hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-slate-400">Price Tier / Admission</span>
                  <span className="font-bold text-white">
                    {place.price || 'Free Admission / Public Access'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Directions, Save, Compare */}
            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 rounded-full text-xs font-bold text-slate-950 glass-blue-btn flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions (GPS)</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(place.id)}
                  className={`h-11 rounded-full text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    isBookmarked
                      ? 'bg-blue-500/20 text-blue-200 border-blue-400/50'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/15'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-blue-400' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save Place'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="h-11 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transit & Commuter Connections */}
          {place.transitOptions && place.transitOptions.length > 0 && (
            <div className="rounded-[32px] p-6 clay-card flex flex-col gap-3.5">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Train className="w-4 h-4" />
                <span>Nearby Transit Connections</span>
              </span>

              <div className="flex flex-col gap-2.5">
                {place.transitOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {opt.type === 'metro' && <Train className="w-4 h-4 text-blue-400" />}
                      {opt.type === 'bus' && <Bus className="w-4 h-4 text-amber-400" />}
                      {opt.type === 'bike' && <Bike className="w-4 h-4 text-emerald-400" />}
                      <span className="font-semibold text-white">{opt.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{opt.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          NEARBY ATTRACTIONS, FOOD SPOTS & STAYS SECTION
          ========================================================================= */}
      <section className="flex flex-col gap-5 pt-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Nearby Experiences in this District
            </h2>
            <p className="text-xs text-slate-400">
              Explore complementary dining, historical landmarks, and boutique stays within walking distance
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'food', 'hotels', 'attractions'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setNearbyFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                  nearbyFilter === cat
                    ? 'glass-blue-btn text-slate-950 font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cat === 'all' ? 'All Nearby' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nearbyPlaces.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPlace(item)}
              className="rounded-[30px] p-4.5 clay-card-interactive flex flex-col justify-between gap-4 cursor-pointer group"
            >
              <div className="flex flex-col gap-3">
                <div className="w-full h-36 rounded-2xl overflow-hidden relative">
                  <PlaceArt iconType={item.clayIcon} themeColor={item.themeColor} />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-bold text-blue-300">
                    {item.category}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                {typeof item.rating === 'number' ? (
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating.toFixed(1)}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Rating Pending</span>
                )}

                <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  View Place →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compare Modal */}
      <ComparePlacesModal
        currentPlace={place}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onSelectComparePlace={onSelectPlace}
      />
    </div>
  );
};
