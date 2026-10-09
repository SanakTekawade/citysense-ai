import React from 'react';
import { Bookmark, Star, MapPin, ArrowRight } from 'lucide-react';
import { POPULAR_PLACES_DATA, RECOMMENDED_PLACES_DATA, PlaceItem } from '../data/cityData';
import { PlaceArt } from './PlaceArt';

interface SavedPageProps {
  savedPlaceIds: string[];
  onSelectPlace: (place: PlaceItem) => void;
  onExploreNow: () => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({
  savedPlaceIds,
  onSelectPlace,
  onExploreNow,
}) => {
  const allPlaces = [...POPULAR_PLACES_DATA, ...RECOMMENDED_PLACES_DATA];
  const bookmarkedPlaces = allPlaces.filter((p) => savedPlaceIds.includes(p.id));

  return (
    <div className="w-full flex flex-col gap-8 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Saved Places & Bookmarks
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Your personal collection of saved stays, spots, and cultural landmarks
        </p>
      </div>

      {bookmarkedPlaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="rounded-[32px] p-5 clay-card-interactive flex flex-col justify-between gap-4 cursor-pointer group"
            >
              <div className="flex flex-col gap-3">
                <div className="w-full h-44 rounded-2xl overflow-hidden relative">
                  <PlaceArt iconType={place.clayIcon} themeColor={place.themeColor} />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-300">
                    {place.category}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">{place.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                {typeof place.rating === 'number' ? (
                  <div className="flex items-center gap-1 font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{place.rating.toFixed(1)}</span>
                  </div>
                ) : (
                  <span className="text-slate-400">{place.statusLabel || 'Pending'}</span>
                )}
                <span className="font-semibold text-blue-400">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/5 border border-white/10 text-center px-4">
          <Bookmark className="w-10 h-10 text-slate-500" />
          <h3 className="text-lg font-bold text-white">No saved places yet</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Browse the Home or Explore page and bookmark your favorite restaurants, hotels, and attractions.
          </p>
          <button
            onClick={onExploreNow}
            className="px-6 py-2.5 rounded-full glass-blue-btn text-xs font-bold text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <span>Explore City Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
