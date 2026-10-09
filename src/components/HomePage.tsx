import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Utensils,
  Building2,
  Landmark,
  Compass,
  ShieldAlert,
  Trees,
  Star,
  Clock,
  MapPin,
  CloudSun,
  Car,
  Users,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import {
  CATEGORIES_DATA,
  POPULAR_PLACES_DATA,
  RECOMMENDED_PLACES_DATA,
  CITY_INSIGHTS_DATA,
  PlaceItem,
} from '../data/cityData';
import { CityClayIllustration } from './CityClayIllustration';
import { PlaceArt } from './PlaceArt';

interface HomePageProps {
  onSearchSubmit: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectPlace: (place: PlaceItem) => void;
  onExploreNow: () => void;
  onViewAllRecommended: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearchSubmit,
  onSelectCategory,
  onSelectPlace,
  onExploreNow,
  onViewAllRecommended,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const handleSearchClick = () => {
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    } else {
      onExploreNow();
    }
  };

  const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    Utensils: Utensils,
    Building2: Building2,
    Landmark: Landmark,
    Compass: Compass,
    ShieldAlert: ShieldAlert,
    Trees: Trees,
  };

  return (
    <div className="w-full flex flex-col gap-14 pb-20">
      {/* =========================================================================
          1. WELCOME BANNER
          - Heading: "Discover your city. Navigate smarter."
          - Subtitle: "Explore hidden gems, local culture, and your surroundings with confidence."
          - Soft 3D clay aesthetic city-exploration illustration
          - Prominent search bar with placeholder "Search places, food, hotels, or attractions..."
          - "Explore Now" button
          ========================================================================= */}
      <section className="relative w-full rounded-[40px] bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/15 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
        {/* Specular highlight rim across top */}
        <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy, Search Bar, CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>CitySense AI · Urban Explorer</span>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Discover your city.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-white">
                  Navigate smarter.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Explore hidden gems, local culture, and your surroundings with confidence.
              </p>
            </div>

            {/* Prominent Search Bar with Reference Liquid Tube Styling */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xl pt-2">
              <div className="relative flex-1 h-[56px] rounded-full glass-tube flex items-center px-5 gap-3 transition-all duration-200">
                <Search className="w-5 h-5 text-slate-400 shrink-0 stroke-[2.2]" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search places, food, hotels, or attractions..."
                  className="w-full bg-transparent border-none outline-none text-[15px] sm:text-[16px] font-medium text-white placeholder-slate-400 tracking-normal focus:ring-0"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-full bg-white/10 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Explore Now Button (Liquid Blue Glass Pill) */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="h-[56px] px-8 rounded-full font-bold text-[16px] text-slate-950 glass-blue-btn flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl cursor-pointer shrink-0"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Suggestions / Micro-pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-400">Popular:</span>
              {['Botanical Biome', 'Rooftop Bistro', 'Historic Clocktower', 'Quiet Cafés'].map((item) => (
                <button
                  key={item}
                  onClick={() => onSearchSubmit(item)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Soft 3D Clay Aesthetic City Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <CityClayIllustration className="w-full max-w-[420px]" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CATEGORY SHORTCUTS
          Five rounded icon cards:
          - Food & Restaurants
          - Hotels & Stays
          - Historical Places
          - Tourist Attractions
          - Safety & Alerts
          ========================================================================= */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Instant access to curated urban experiences and live municipal feeds
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES_DATA.map((cat) => {
            const IconComponent = categoryIcons[cat.icon] || Compass;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                type="button"
                className="group relative rounded-[28px] p-5 clay-card-interactive flex flex-col items-start justify-between min-h-[148px] text-left cursor-pointer overflow-hidden"
              >
                {/* Top specular highlight edge */}
                <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                {/* Category Icon Capsule */}
                <div className="w-12 h-12 rounded-2xl glass-tube flex items-center justify-center text-blue-300 group-hover:scale-110 group-hover:text-white transition-transform">
                  <IconComponent className="w-5 h-5 stroke-[2]" />
                </div>

                <div className="flex flex-col gap-0.5 mt-4">
                  <span className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {cat.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. POPULAR PLACES
          Three or four attractive place cards with images, names, categories,
          and ratings ONLY when available.
          ========================================================================= */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending Destinations</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Popular Places
            </h2>
          </div>

          <button
            onClick={onExploreNow}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_PLACES_DATA.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="group rounded-[32px] p-4 clay-card-interactive flex flex-col justify-between gap-4 cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                {/* Visual Artwork Thumbnail */}
                <div className="w-full h-40 rounded-2xl overflow-hidden relative">
                  <PlaceArt iconType={place.clayIcon} themeColor={place.themeColor} />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-300">
                    {place.category}
                  </span>
                </div>

                {/* Place Name */}
                <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors leading-snug">
                  {place.name}
                </h3>

                {/* Address / Distance */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{place.distance}</span>
                </div>
              </div>

              {/* Bottom Row: Ratings ONLY when available, or pending label */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                {typeof place.rating === 'number' ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{place.rating.toFixed(1)}</span>
                    {place.reviewsCount ? (
                      <span className="text-[11px] font-normal text-slate-400">
                        ({place.reviewsCount})
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400">
                    {place.statusLabel || 'Rating Pending'}
                  </span>
                )}

                <span className="text-xs font-semibold text-slate-300 group-hover:translate-x-0.5 transition-transform">
                  Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. CITY INSIGHTS
          Compact cards for:
          - Current weather
          - Traffic information
          - Recent community reports
          Connect available data sources or clearly label unavailable information.
          ========================================================================= */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            City Insights & Vital Signs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time urban conditions and community alerts from connected civic networks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Current Weather */}
          <div className="rounded-[30px] p-6 clay-card flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-amber-300" />
                  <span>Current Weather</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  Live
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  {CITY_INSIGHTS_DATA.weather.temperature}{CITY_INSIGHTS_DATA.weather.unit}
                </span>
                <span className="text-sm font-semibold text-slate-300">
                  {CITY_INSIGHTS_DATA.weather.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[11px]">High / Low</span>
                  <span className="font-semibold text-white">
                    {CITY_INSIGHTS_DATA.weather.high}° / {CITY_INSIGHTS_DATA.weather.low}°
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Air Quality</span>
                  <span className="font-semibold text-emerald-400">
                    {CITY_INSIGHTS_DATA.weather.airQualityStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400">
              {CITY_INSIGHTS_DATA.weather.lastUpdated}
            </div>
          </div>

          {/* Card 2: Traffic Information */}
          <div className="rounded-[30px] p-6 clay-card flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-blue-300" />
                  <span>Traffic & Transit</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                  {CITY_INSIGHTS_DATA.traffic.status}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-lg font-bold text-white">
                  {CITY_INSIGHTS_DATA.traffic.summary}
                </h4>
                <p className="text-xs text-slate-300">
                  {CITY_INSIGHTS_DATA.traffic.metroStatus}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>{CITY_INSIGHTS_DATA.traffic.corridorNote}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400">
              {CITY_INSIGHTS_DATA.traffic.lastUpdated}
            </div>
          </div>

          {/* Card 3: Recent Community Reports */}
          <div className="rounded-[30px] p-6 clay-card flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-300" />
                  <span>Community Reports</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                  3 Verified
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {CITY_INSIGHTS_DATA.communityReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-white truncate max-w-[190px]">
                        {report.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {report.location} · {report.timeAgo}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 shrink-0">
                      +{report.upvotes}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Verified Citizen Network</span>
              <span className="text-blue-400 font-medium">All Systems Normal</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. RECOMMENDED PLACES
          Horizontal row of recommended destinations with images and a "View All" link.
          ========================================================================= */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recommended for You
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized places tailored to mild weather and walkable routes
            </p>
          </div>

          <button
            onClick={onViewAllRecommended}
            className="flex items-center gap-1 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Row with smooth scroll */}
        <div className="w-full overflow-x-auto no-scrollbar pb-4 pt-1">
          <div className="flex items-stretch gap-5 min-w-max">
            {RECOMMENDED_PLACES_DATA.map((place) => (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="w-72 rounded-[32px] p-4 clay-card-interactive flex flex-col justify-between gap-4 cursor-pointer group"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-full h-36 rounded-2xl overflow-hidden relative">
                    <PlaceArt iconType={place.clayIcon} themeColor={place.themeColor} />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-300">
                      {place.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {place.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{place.rating?.toFixed(1)}</span>
                  </div>

                  <span className="text-slate-400">{place.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
