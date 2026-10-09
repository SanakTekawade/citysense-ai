import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  DollarSign,
  Accessibility,
  ArrowUpDown,
  X,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Share2,
  Navigation,
  Compass,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  CATEGORIES_DATA,
  POPULAR_PLACES_DATA,
  RECOMMENDED_PLACES_DATA,
  PlaceItem,
} from '../data/cityData';
import { ExploreMap } from './ExploreMap';
import { PlaceArt } from './PlaceArt';

interface ExplorePageProps {
  initialSearchQuery?: string;
  initialCategoryId?: string;
  onSelectPlace?: (place: PlaceItem) => void;
  onBackToHome?: () => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  initialSearchQuery = '',
  initialCategoryId = 'all',
  onSelectPlace,
}) => {
  // Search & Category
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);

  // Filter States
  const [budgetFilter, setBudgetFilter] = useState<'all' | 'Free' | '$' | '$$' | '$$$' | '$$$$'>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = all
  const [minRating, setMinRating] = useState<number>(0); // 0 = all
  const [accessibilityOnly, setAccessibilityOnly] = useState<boolean>(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Sorting State
  const [sortBy, setSortBy] = useState<'relevance' | 'distance' | 'rating' | 'price-asc' | 'price-desc'>('relevance');

  // Mobile View Toggle: 'map' or 'list'
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  // Active / Selected Place (synchronized between map and results panel)
  const [activeSelectedPlace, setActiveSelectedPlace] = useState<PlaceItem | null>(null);

  // Bookmarking state
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(['pop-1']);

  // Loading simulation state
  const [isLoading, setIsLoading] = useState(false);

  // Master Places List
  const allPlaces = useMemo(() => {
    const combined = [...POPULAR_PLACES_DATA, ...RECOMMENDED_PLACES_DATA];
    const seen = new Set();
    return combined.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, []);

  // Update category when initialCategoryId prop changes
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  // Update search when initialSearchQuery prop changes
  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Simulate fast filtering transition
  const triggerFilterTransition = () => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  };

  // Filter and Sort Places
  const filteredAndSortedPlaces = useMemo(() => {
    let result = allPlaces.filter((item) => {
      // 1. Category Filter: 'all', 'food', 'hotels', 'history', 'attractions', 'parks'
      const matchesCategory =
        selectedCategory === 'all' || item.categoryId === selectedCategory;

      // 2. Search Query Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      // 3. Budget Filter
      const matchesBudget =
        budgetFilter === 'all' || item.priceLevel === budgetFilter;

      // 4. Distance Filter
      const matchesDistance =
        maxDistanceKm === 0 || item.distanceKm <= maxDistanceKm;

      // 5. Rating Filter
      const matchesRating =
        minRating === 0 || (typeof item.rating === 'number' && item.rating >= minRating);

      // 6. Accessibility Filter
      const matchesAccessibility = !accessibilityOnly || item.accessible === true;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesBudget &&
        matchesDistance &&
        matchesRating &&
        matchesAccessibility
      );
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'rating') {
        const ratingA = a.rating ?? -1;
        const ratingB = b.rating ?? -1;
        return ratingB - ratingA;
      }
      if (sortBy === 'price-asc') {
        const priceOrder: Record<string, number> = { Free: 0, $: 1, $$: 2, $$$: 3, $$$$: 4 };
        const valA = priceOrder[a.priceLevel || '$'] ?? 2;
        const valB = priceOrder[b.priceLevel || '$'] ?? 2;
        return valA - valB;
      }
      if (sortBy === 'price-desc') {
        const priceOrder: Record<string, number> = { Free: 0, $: 1, $$: 2, $$$: 3, $$$$: 4 };
        const valA = priceOrder[a.priceLevel || '$'] ?? 2;
        const valB = priceOrder[b.priceLevel || '$'] ?? 2;
        return valB - valA;
      }
      // Default: relevance (preserve curated order)
      return 0;
    });

    return result;
  }, [
    allPlaces,
    selectedCategory,
    searchQuery,
    budgetFilter,
    maxDistanceKm,
    minRating,
    accessibilityOnly,
    sortBy,
  ]);

  // Select place handler (synchronizes map and results panel)
  const handleSelectPlace = (place: PlaceItem) => {
    setActiveSelectedPlace(place);
    onSelectPlace?.(place);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPlaceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setBudgetFilter('all');
    setMaxDistanceKm(0);
    setMinRating(0);
    setAccessibilityOnly(false);
    setSortBy('relevance');
    triggerFilterTransition();
  };

  // Count active filter pills
  const activeFiltersCount =
    (budgetFilter !== 'all' ? 1 : 0) +
    (maxDistanceKm > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (accessibilityOnly ? 1 : 0);

  return (
    <div className="w-full flex flex-col gap-6 pb-16">
      {/* =========================================================================
          PAGE HEADER: Title, Search bar, and Mobile Map/List Toggle
          ========================================================================= */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Explore your city
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive metropolitan map, curated venues, and live sensory coordinates
            </p>
          </div>

          {/* Mobile Map / List Toggle (Signature Segmented Capsule) */}
          <div className="flex lg:hidden items-center self-start sm:self-auto">
            <div className="h-11 w-44 rounded-full glass-segmented-container p-1 flex items-center">
              <button
                type="button"
                onClick={() => setMobileView('map')}
                className={`flex-1 h-full rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  mobileView === 'map'
                    ? 'glass-segmented-blue text-slate-950 shadow-sm'
                    : 'text-slate-300'
                }`}
              >
                Map View
              </button>
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className={`flex-1 h-full rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  mobileView === 'list'
                    ? 'glass-segmented-white text-slate-950 shadow-sm'
                    : 'text-slate-300'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar for Locations, Restaurants, Hotels, and Attractions */}
        <div className="relative w-full h-[54px] rounded-full glass-tube flex items-center px-5 gap-3 transition-all duration-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0 stroke-[2.2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              triggerFilterTransition();
            }}
            placeholder="Search locations, restaurants, hotels, and attractions..."
            className="w-full bg-transparent border-none outline-none text-[15px] sm:text-[16px] font-medium text-white placeholder-slate-400 tracking-normal focus:ring-0"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                triggerFilterTransition();
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-full bg-white/10 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filters: All, Food, Hotels, History, Attractions, Parks */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* All */}
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                triggerFilterTransition();
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'glass-blue-btn text-slate-950 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              All Categories
            </button>

            {/* Food, Hotels, History, Attractions, Parks */}
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  triggerFilterTransition();
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'glass-blue-btn text-slate-950 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Filter Panel Drawer Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
              isFilterPanelOpen || activeFiltersCount > 0
                ? 'bg-blue-500/20 text-blue-200 border-blue-400/50'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-500 text-slate-950 text-[10px] font-bold flex items-center justify-center ml-0.5">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filter & Sorting Controls Strip */}
        {isFilterPanelOpen && (
          <div className="w-full p-5 rounded-[28px] bg-black border border-white/15 flex flex-col gap-5 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Refine Search Parameters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filter 1: Budget */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                  Budget / Pricing
                </label>
                <div className="flex items-center gap-1 flex-wrap">
                  {(['all', 'Free', '$', '$$', '$$$', '$$$$'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudgetFilter(b)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        budgetFilter === b
                          ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {b === 'all' ? 'Any' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 2: Max Distance */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  Radius Distance
                </label>
                <div className="flex items-center gap-1.5">
                  {[
                    { label: 'Any', val: 0 },
                    { label: '< 1 km', val: 1.0 },
                    { label: '< 2 km', val: 2.0 },
                    { label: '< 5 km', val: 5.0 },
                  ].map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setMaxDistanceKm(d.val)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        maxDistanceKm === d.val
                          ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 3: Rating */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  Minimum Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[
                    { label: 'All', val: 0 },
                    { label: '4.5+ ★', val: 4.5 },
                    { label: '4.8+ ★', val: 4.8 },
                  ].map((r) => (
                    <button
                      key={r.label}
                      onClick={() => setMinRating(r.val)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        minRating === r.val
                          ? 'bg-amber-400/20 text-amber-200 border border-amber-400/50'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 4: Accessibility */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Accessibility className="w-3.5 h-3.5 text-emerald-400" />
                  Accessibility
                </label>
                <button
                  type="button"
                  onClick={() => setAccessibilityOnly(!accessibilityOnly)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    accessibilityOnly
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/50'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  <span>Step-Free / Accessible</span>
                  {accessibilityOnly ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : null}
                </button>
              </div>
            </div>

            {/* Sorting Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
                <span>Sort Results:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'relevance' as const, label: 'Relevance' },
                  { id: 'distance' as const, label: 'Distance' },
                  { id: 'rating' as const, label: 'Rating' },
                  { id: 'price-asc' as const, label: 'Price: Low to High' },
                  { id: 'price-desc' as const, label: 'Price: High to Low' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      sortBy === s.id
                        ? 'bg-white text-slate-950 font-bold shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MAIN EXPLORE VIEW:
          Interactive Map (occupying main portion) & Location-Results Panel
          Synchronized two-way selection.
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAP CONTAINER (Occupies 7 cols on desktop; responsive toggle on mobile) */}
        <div
          className={`lg:col-span-7 h-[580px] lg:h-[680px] w-full sticky top-20 ${
            mobileView === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <ExploreMap
            places={filteredAndSortedPlaces}
            selectedPlace={activeSelectedPlace}
            onSelectPlace={handleSelectPlace}
            className="h-full shadow-2xl"
          />
        </div>

        {/* LOCATION-RESULTS PANEL (Occupies 5 cols on desktop; responsive toggle on mobile) */}
        <div
          className={`lg:col-span-5 flex flex-col gap-4 ${
            mobileView === 'map' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Header of results panel */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {filteredAndSortedPlaces.length} Location
              {filteredAndSortedPlaces.length === 1 ? '' : 's'} Found
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Loading Skeleton Indicator */}
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-[28px] p-4 bg-white/5 border border-white/10 animate-pulse h-36 flex flex-col justify-between"
                >
                  <div className="h-4 bg-white/10 rounded-full w-2/3" />
                  <div className="h-3 bg-white/10 rounded-full w-1/2" />
                  <div className="h-3 bg-white/10 rounded-full w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedPlaces.length > 0 ? (
            /* Results Cards List */
            <div className="flex flex-col gap-4 max-h-[660px] overflow-y-auto pr-1 no-scrollbar">
              {filteredAndSortedPlaces.map((place) => {
                const isSelected = activeSelectedPlace?.id === place.id;
                const isSaved = savedPlaceIds.includes(place.id);

                return (
                  <div
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className={`rounded-[28px] p-4.5 clay-card-interactive flex flex-col gap-3.5 cursor-pointer relative transition-all ${
                      isSelected
                        ? 'border-blue-400/80 bg-blue-950/20 shadow-[0_0_25px_rgba(96,165,250,0.25)]'
                        : ''
                    }`}
                  >
                    {/* Top Row: Thumbnail + Title + Bookmark */}
                    <div className="flex items-start gap-3.5">
                      {/* Image Thumbnail */}
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative bg-slate-900 border border-white/10">
                        <PlaceArt
                          iconType={place.clayIcon}
                          themeColor={place.themeColor}
                          className="min-h-0 h-full rounded-none"
                        />
                      </div>

                      {/* Info Content */}
                      <div className="flex flex-col flex-1 min-w-0 gap-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                            {place.category}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(place.id, e)}
                            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Bookmark place"
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                isSaved ? 'fill-blue-400 text-blue-400' : ''
                              }`}
                            />
                          </button>
                        </div>

                        <h3 className="font-bold text-base text-white truncate leading-snug group-hover:text-blue-300">
                          {place.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                          <span>{place.distance}</span>
                          {place.accessible && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <Accessibility className="w-3 h-3" />
                                <span>Accessible</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata: Rating when available & Price Range when available */}
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                      {/* Rating ONLY when available */}
                      {typeof place.rating === 'number' ? (
                        <div className="flex items-center gap-1 font-bold text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{place.rating.toFixed(1)}</span>
                          {place.reviewsCount ? (
                            <span className="text-[11px] font-normal text-slate-400">
                              ({place.reviewsCount})
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {place.statusLabel || 'Rating Pending'}
                        </span>
                      )}

                      {/* Price Range when available */}
                      {place.price ? (
                        <span className="text-xs font-semibold text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                          {place.price}
                        </span>
                      ) : null}

                      <span
                        className={`text-xs font-bold transition-colors ${
                          isSelected ? 'text-blue-300' : 'text-slate-400'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'View on Map →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="w-full py-16 px-6 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center gap-4">
              <Compass className="w-12 h-12 text-slate-500" />
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-white">No locations found</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  We couldn't find matches for your current search and filter combination.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-full glass-white-btn text-xs font-bold text-slate-950 cursor-pointer shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          LOCATION-DETAILS PANEL (When user selects a place)
          Slide-in / Expandable bottom card with complete venue intelligence
          ========================================================================= */}
      {activeSelectedPlace && (
        <div className="w-full p-6 sm:p-8 rounded-[36px] bg-black border border-white/20 shadow-2xl relative animate-fadeIn flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Location Details · Selected Venue
              </span>
            </div>

            <button
              onClick={() => setActiveSelectedPlace(null)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Header */}
            <div className="lg:col-span-4 h-48 sm:h-56 rounded-2xl overflow-hidden relative">
              <PlaceArt
                iconType={activeSelectedPlace.clayIcon}
                themeColor={activeSelectedPlace.themeColor}
                className="h-full rounded-2xl"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-300">
                {activeSelectedPlace.category}
              </span>
            </div>

            {/* Core Venue Info */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {activeSelectedPlace.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{activeSelectedPlace.address}</span>
                    <span>·</span>
                    <span>{activeSelectedPlace.distance}</span>
                  </div>
                </div>

                {/* Rating only when available */}
                {typeof activeSelectedPlace.rating === 'number' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold text-sm shrink-0">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{activeSelectedPlace.rating.toFixed(1)}</span>
                    {activeSelectedPlace.reviewsCount ? (
                      <span className="text-xs text-slate-400 font-normal">
                        ({activeSelectedPlace.reviewsCount})
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-400">
                    {activeSelectedPlace.statusLabel || 'Rating Pending'}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeSelectedPlace.description}
              </p>

              {/* Operating details & tags */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{activeSelectedPlace.hours}</span>
                </div>

                {activeSelectedPlace.price && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeSelectedPlace.price}</span>
                  </div>
                )}

                {activeSelectedPlace.accessible && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-400/20">
                    <Accessibility className="w-3.5 h-3.5" />
                    <span>Step-Free Access</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => toggleBookmark(activeSelectedPlace.id, e)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      savedPlaceIds.includes(activeSelectedPlace.id)
                        ? 'fill-blue-400 text-blue-400'
                        : ''
                    }`}
                  />
                  <span>
                    {savedPlaceIds.includes(activeSelectedPlace.id) ? 'Saved' : 'Save'}
                  </span>
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${activeSelectedPlace.name} ${activeSelectedPlace.address}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-full text-xs font-bold text-slate-950 glass-blue-btn flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
