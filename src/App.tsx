import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ExplorePage } from './components/ExplorePage';
import { AIAssistantPage } from './components/AIAssistantPage';
import { SavedPage } from './components/SavedPage';
import { SafetyMapPage } from './components/SafetyMapPage';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { PlaceDetailsPage } from './components/PlaceDetailsPage';
import { Footer } from './components/Footer';
import { PlaceItem, POPULAR_PLACES_DATA, RECOMMENDED_PLACES_DATA } from './data/cityData';
import { Home, Compass, Sparkles, ShieldAlert, Bookmark, ArrowUp } from 'lucide-react';
import { BackgroundScrollCanvas } from './components/BackgroundScrollCanvas';

type SectionKey = 'home' | 'explore' | 'assistant' | 'saved' | 'alerts';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('home');
  const [viewingDetails, setViewingDetails] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(['pop-1', 'rec-2']);
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (sectionKey: SectionKey) => {
    if (viewingDetails) {
      setViewingDetails(false);
      setTimeout(() => {
        const el = document.getElementById(`section-${sectionKey}`);
        if (el) {
          const yOffset = -76;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 60);
      return;
    }

    const el = document.getElementById(`section-${sectionKey}`);
    if (el) {
      const yOffset = -76;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Synchronized active section detection based on continuous scrolling
  useEffect(() => {
    if (viewingDetails) return;

    const sections: SectionKey[] = ['home', 'explore', 'assistant', 'alerts', 'saved'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      setShowBackToTop(window.scrollY > 400);

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(`section-${id}`);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewingDetails]);

  // Navigation handlers
  const handleNavigate = (page: 'home' | 'explore' | 'assistant' | 'saved' | 'alerts' | 'place-details') => {
    if (page === 'place-details') {
      setViewingDetails(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection(page);
    }
  };

  const handleOpenPlaceDetails = (place: PlaceItem) => {
    setSelectedPlace(place);
    setViewingDetails(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromPlaceDetails = () => {
    setViewingDetails(false);
    setTimeout(() => {
      scrollToSection(activeSection);
    }, 50);
  };

  const handleNavigateToMapFromDetails = (placeId: string) => {
    setViewingDetails(false);
    const allPlaces = [...POPULAR_PLACES_DATA, ...RECOMMENDED_PLACES_DATA];
    const found = allPlaces.find((p) => p.id === placeId);
    if (found) {
      setSelectedPlace(found);
    }
    setTimeout(() => {
      scrollToSection('explore');
    }, 60);
  };

  const handleNavigateToMapFromAssistant = (placeId?: string) => {
    if (placeId) {
      const allPlaces = [...POPULAR_PLACES_DATA, ...RECOMMENDED_PLACES_DATA];
      const found = allPlaces.find((p) => p.id === placeId);
      if (found) {
        setSelectedPlace(found);
      }
    }
    scrollToSection('explore');
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setSelectedCategoryId('all');
    scrollToSection('explore');
  };

  const handleSelectCategory = (catId: string) => {
    if (catId === 'safety') {
      scrollToSection('alerts');
    } else {
      setSelectedCategoryId(catId);
      setSearchQuery('');
      scrollToSection('explore');
    }
  };

  const handleExploreNow = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    scrollToSection('explore');
  };

  const handleViewAllRecommended = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    scrollToSection('explore');
  };

  const handleToggleBookmark = (id: string) => {
    setSavedPlaceIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const currentDisplayPage = viewingDetails ? 'place-details' : activeSection;

  return (
    <div className="relative min-h-screen bg-black/40 text-white flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background 300-Frame Scroll Animation with subtle blur */}
      <BackgroundScrollCanvas />

      {/* Responsive Sidebar */}
      <Sidebar
        activePage={currentDisplayPage}
        onNavigate={handleNavigate}
        savedCount={savedPlaceIds.length}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area (offset by sidebar on lg screens) */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0 transition-all">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={handleNavigate}
          activePage={currentDisplayPage}
          weatherTemp="72°F"
          notificationsActive={notificationsActive}
          onToggleNotifications={() => setNotificationsActive(!notificationsActive)}
        />

        {/* Page Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {viewingDetails ? (
            <PlaceDetailsPage
              place={selectedPlace || POPULAR_PLACES_DATA[0]}
              onBack={handleBackFromPlaceDetails}
              onSelectPlace={handleOpenPlaceDetails}
              isBookmarked={savedPlaceIds.includes(selectedPlace ? selectedPlace.id : POPULAR_PLACES_DATA[0].id)}
              onToggleBookmark={handleToggleBookmark}
              onNavigateToMap={handleNavigateToMapFromDetails}
            />
          ) : (
            <div className="flex flex-col gap-24">
              {/* SECTION 1: HOME */}
              <section id="section-home" className="scroll-mt-20">
                <HomePage
                  onSearchSubmit={handleSearchSubmit}
                  onSelectCategory={handleSelectCategory}
                  onSelectPlace={handleOpenPlaceDetails}
                  onExploreNow={handleExploreNow}
                  onViewAllRecommended={handleViewAllRecommended}
                />
              </section>

              {/* SECTION 2: EXPLORE */}
              <section id="section-explore" className="scroll-mt-20 pt-8 border-t border-white/10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-bold text-blue-400">
                      City Exploration & Discovery
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Interactive Map & Location Results
                  </span>
                </div>
                <ExplorePage
                  initialSearchQuery={searchQuery}
                  initialCategoryId={selectedCategoryId}
                  onSelectPlace={handleOpenPlaceDetails}
                  onBackToHome={() => scrollToSection('home')}
                />
              </section>

              {/* SECTION 3: AI ASSISTANT */}
              <section id="section-assistant" className="scroll-mt-20 pt-8 border-t border-white/10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                      AI Urban Assistant
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Conversational Local Intelligence & Recommendations
                  </span>
                </div>
                <AIAssistantPage
                  onOpenPlaceDetail={handleOpenPlaceDetails}
                  onNavigateToMap={handleNavigateToMapFromAssistant}
                  onNavigateToSafety={() => scrollToSection('alerts')}
                />
              </section>

              {/* SECTION 4: SAFETY MAP */}
              <section id="section-alerts" className="scroll-mt-20 pt-8 border-t border-white/10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                      Surroundings & Safety Monitoring
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Live Incident Map & Route Hazards
                  </span>
                </div>
                <SafetyMapPage />
              </section>

              {/* SECTION 5: SAVED PLACES */}
              <section id="section-saved" className="scroll-mt-20 pt-8 border-t border-white/10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                      Personal Bookmarks
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    {savedPlaceIds.length} Saved Stays & Landmarks
                  </span>
                </div>
                <SavedPage
                  savedPlaceIds={savedPlaceIds}
                  onSelectPlace={handleOpenPlaceDetails}
                  onExploreNow={handleExploreNow}
                />
              </section>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Floating Bottom Quick-Jump Dock (Continuous Scroll Navigator) */}
      {!viewingDetails && (
        <aside aria-label="Quick section navigation" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
          <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-black/80 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80">
            <button
              onClick={() => scrollToSection('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'home'
                  ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              onClick={() => scrollToSection('explore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'explore'
                  ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Explore</span>
            </button>

            <button
              onClick={() => scrollToSection('assistant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'assistant'
                  ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistant</span>
            </button>

            <button
              onClick={() => scrollToSection('alerts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'alerts'
                  ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Safety</span>
            </button>

            <button
              onClick={() => scrollToSection('saved')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'saved'
                  ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
              {savedPlaceIds.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {savedPlaceIds.length}
                </span>
              )}
            </button>

            {showBackToTop && (
              <div className="pl-1 border-l border-white/10">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  title="Back to Top"
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Place Details Modal for quick preview */}
      {selectedPlace && !viewingDetails && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          isBookmarked={savedPlaceIds.includes(selectedPlace.id)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}
    </div>
  );
}
