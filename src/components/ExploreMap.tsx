import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PlaceItem } from '../data/cityData';
import { Maximize2, Minimize2, Navigation, Layers, RefreshCw } from 'lucide-react';

interface ExploreMapProps {
  places: PlaceItem[];
  selectedPlace: PlaceItem | null;
  onSelectPlace: (place: PlaceItem) => void;
  className?: string;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [tileMode, setTileMode] = useState<'dark' | 'standard'>('dark');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    try {
      // Default center around San Francisco coordinates
      const defaultCenter: L.LatLngExpression = [37.7749, -122.4194];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false, // We'll add custom positioned zoom control
        attributionControl: false,
        scrollWheelZoom: false, // Don't trap continuous page scrolling
      });

      // Add Attribution cleanly
      L.control
        .attribution({
          position: 'bottomright',
          prefix: false,
        })
        .addTo(map)
        .addAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" class="text-slate-400 hover:text-white">OSM</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer" class="text-slate-400 hover:text-white">CARTO</a>'
        );

      // Add Zoom Control at top right
      L.control
        .zoom({
          position: 'topright',
        })
        .addTo(map);

      // Dark Matter Tile Layer matching obsidian plane black aesthetic
      const darkTiles = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 19,
        }
      );

      darkTiles.addTo(map);
      tileLayerRef.current = darkTiles;

      // Create Markers Layer
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      mapInstanceRef.current = map;
      setIsMapReady(true);
      setMapError(null);

      // Force resize on next tick to avoid grey map tiles
      setTimeout(() => {
        map.invalidateSize();
      }, 250);

      // Invalidate size on intersection with viewport (for continuous scrolling)
      if (mapContainerRef.current && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0]?.isIntersecting) {
            map.invalidateSize();
          }
        }, { threshold: 0.1 });
        observer.observe(mapContainerRef.current);
      }
    } catch (err: any) {
      console.error('Error initializing Leaflet map:', err);
      setMapError(err?.message || 'Failed to load interactive map tiles.');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer if tileMode toggled
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      tileMode === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: tileMode === 'dark' ? 'abcd' : 'abc',
    });

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  }, [tileMode]);

  // Synchronize Markers whenever places or selectedPlace change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (places.length === 0) return;

    const bounds = L.latLngBounds([]);

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      bounds.extend([place.lat, place.lng]);

      // Category color accents
      let bgStyle = 'linear-gradient(180deg, rgba(166,198,236,0.95), rgba(135,175,222,0.85))';
      let borderStyle = 'rgba(255,255,255,0.6)';

      if (place.categoryId === 'food') {
        bgStyle = 'linear-gradient(180deg, rgba(96,165,250,0.95), rgba(59,130,246,0.85))';
      } else if (place.categoryId === 'hotels') {
        bgStyle = 'linear-gradient(180deg, rgba(147,197,253,0.95), rgba(96,165,250,0.85))';
      } else if (place.categoryId === 'history') {
        bgStyle = 'linear-gradient(180deg, rgba(251,191,36,0.95), rgba(245,158,11,0.85))';
      } else if (place.categoryId === 'parks') {
        bgStyle = 'linear-gradient(180deg, rgba(52,211,153,0.95), rgba(16,185,129,0.85))';
      }

      // Create Custom HTML Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-clay-marker',
        html: `
          <div style="
            position: relative;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          ">
            <div style="
              width: ${isSelected ? '36px' : '28px'};
              height: ${isSelected ? '36px' : '28px'};
              border-radius: 9999px;
              background: ${bgStyle};
              border: ${isSelected ? '2.5px solid #ffffff' : `1.5px solid ${borderStyle}`};
              box-shadow: ${
                isSelected
                  ? '0 0 20px rgba(96,165,250,0.8), 0 8px 16px rgba(0,0,0,0.8)'
                  : '0 4px 12px rgba(0,0,0,0.6)'
              };
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0f172a;
              font-weight: 800;
              font-size: ${isSelected ? '12px' : '10px'};
              font-family: 'Plus Jakarta Sans', sans-serif;
            ">
              ${place.rating ? place.rating.toFixed(1) : '★'}
            </div>
            ${
              isSelected
                ? `
              <div style="
                position: absolute;
                bottom: -28px;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
                background: rgba(0,0,0,0.85);
                border: 1px solid rgba(255,255,255,0.3);
                backdrop-filter: blur(12px);
                color: #ffffff;
                font-size: 11px;
                font-weight: 700;
                padding: 2px 8px;
                border-radius: 9999px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.9);
                pointer-events: none;
              ">
                ${place.name}
              </div>
            `
                : ''
            }
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectPlace(place);
      });

      markersLayer.addLayer(marker);
    });

    // If a place is selected, pan smoothly to it
    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 14, {
        duration: 0.8,
      });
    } else if (places.length > 0) {
      // Fit all markers in bounds on initial load
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [places, selectedPlace, onSelectPlace]);

  // Recenter map
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map || places.length === 0) return;

    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  };

  return (
    <div
      className={`relative w-full h-full min-h-[420px] rounded-[32px] overflow-hidden border border-white/15 bg-black ${className}`}
    >
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Control Bar Floating (top-left) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/80 hover:bg-black border border-white/20 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title="Fit all places in view"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>Fit All ({places.length})</span>
        </button>

        <button
          onClick={() => setTileMode((prev) => (prev === 'dark' ? 'standard' : 'dark'))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/80 hover:bg-black border border-white/20 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title="Toggle map style"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="capitalize">{tileMode} Map</span>
        </button>
      </div>

      {/* Map Legend Overlay (bottom-left) */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-black/80 border border-white/15 text-[11px] text-slate-300 backdrop-blur-md">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          Food
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-300" />
          Hotels
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          History
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Parks
        </span>
      </div>

      {/* Error State */}
      {mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/90 text-center gap-3">
          <p className="text-sm text-red-300 font-medium">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-950 glass-white-btn flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Map</span>
          </button>
        </div>
      )}
    </div>
  );
};
