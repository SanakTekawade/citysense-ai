import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SafetyIncidentItem, RouteOption } from '../data/cityData';
import { Navigation, Layers, RefreshCw, ShieldAlert, AlertTriangle, Lightbulb, Bell, CheckCircle2 } from 'lucide-react';

interface SafetyMapProps {
  incidents: SafetyIncidentItem[];
  selectedIncident: SafetyIncidentItem | null;
  onSelectIncident: (incident: SafetyIncidentItem) => void;
  activeRoute: RouteOption | null;
  className?: string;
}

export const SafetyMap: React.FC<SafetyMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  activeRoute,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const [tileMode, setTileMode] = useState<'dark' | 'standard'>('dark');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const defaultCenter: L.LatLngExpression = [37.7815, -122.4125];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false, // Don't trap continuous page scrolling
      });

      L.control
        .attribution({ position: 'bottomright', prefix: false })
        .addTo(map)
        .addAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" class="text-slate-400 hover:text-white">OSM</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer" class="text-slate-400 hover:text-white">CARTO</a>'
        );

      L.control.zoom({ position: 'topright' }).addTo(map);

      const darkTiles = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      );
      darkTiles.addTo(map);
      tileLayerRef.current = darkTiles;

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      const routeLayer = L.layerGroup().addTo(map);
      routeLayerRef.current = routeLayer;

      mapInstanceRef.current = map;

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
    } catch (err) {
      console.error('Error initializing SafetyMap:', err);
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

  // Synchronize Incident Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (incidents.length === 0) return;

    const bounds = L.latLngBounds([]);

    incidents.forEach((item) => {
      const isSelected = selectedIncident?.id === item.id;
      bounds.extend([item.lat, item.lng]);

      // Category Differentiated Color Palettes
      let bgColor = 'rgba(239, 68, 68, 0.9)'; // Rose for Accidents
      let glowColor = 'rgba(239, 68, 68, 0.5)';
      let symbol = '!';

      if (item.categoryId === 'accident') {
        bgColor = 'linear-gradient(180deg, #f87171, #ef4444)';
        glowColor = 'rgba(239, 68, 68, 0.6)';
        symbol = '⚠';
      } else if (item.categoryId === 'hazard') {
        bgColor = 'linear-gradient(180deg, #fbbf24, #f59e0b)';
        glowColor = 'rgba(245, 158, 11, 0.6)';
        symbol = '▲';
      } else if (item.categoryId === 'lighting') {
        bgColor = 'linear-gradient(180deg, #38bdf8, #0ea5e9)';
        glowColor = 'rgba(14, 165, 233, 0.6)';
        symbol = '💡';
      } else if (item.categoryId === 'alert') {
        bgColor = 'linear-gradient(180deg, #c084fc, #9333ea)';
        glowColor = 'rgba(147, 51, 234, 0.6)';
        symbol = '🛡';
      }

      const customHtml = `
        <div style="
          position: relative;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <!-- Main Icon Pin -->
          <div style="
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            border-radius: 9999px;
            background: ${bgColor};
            border: ${isSelected ? '3px solid #ffffff' : item.isVerified ? '2px solid rgba(255,255,255,0.85)' : '2px dashed rgba(255,255,255,0.6)'};
            box-shadow: 0 4px 14px ${glowColor}, 0 6px 20px rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: ${isSelected ? '14px' : '11px'};
            font-weight: 800;
            transition: all 0.2s ease-out;
          ">
            ${symbol}
          </div>

          <!-- Verified Checkmark Badge on Pin Corner -->
          ${
            item.isVerified
              ? `
            <div style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 14px;
              height: 14px;
              border-radius: 9999px;
              background: #10b981;
              border: 1.5px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8px;
              color: #ffffff;
              font-weight: 900;
            ">
              ✓
            </div>
          `
              : `
            <div style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 14px;
              height: 14px;
              border-radius: 9999px;
              background: #64748b;
              border: 1.5px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8px;
              color: #ffffff;
              font-weight: 900;
            ">
              ?
            </div>
          `
          }

          <!-- Floating Name Label if Selected -->
          ${
            isSelected
              ? `
            <div style="
              position: absolute;
              bottom: -28px;
              left: 50%;
              transform: translateX(-50%);
              white-space: nowrap;
              background: rgba(0,0,0,0.9);
              border: 1px solid rgba(255,255,255,0.3);
              backdrop-filter: blur(10px);
              color: #ffffff;
              font-size: 11px;
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 9999px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.9);
              pointer-events: none;
            ">
              ${item.title}
            </div>
          `
              : ''
          }
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-safety-pin',
        html: customHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([item.lat, item.lng], { icon });

      marker.on('click', () => {
        onSelectIncident(item);
      });

      markersLayer.addLayer(marker);
    });

    if (selectedIncident) {
      map.flyTo([selectedIncident.lat, selectedIncident.lng], 14, { duration: 0.8 });
    }
  }, [incidents, selectedIncident, onSelectIncident]);

  // Synchronize Active Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    routeLayer.clearLayers();

    if (!activeRoute) return;

    // Draw main glowing route line
    const polylineGlow = L.polyline(activeRoute.coordinates, {
      color: '#60a5fa',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
    });

    const polylineCore = L.polyline(activeRoute.coordinates, {
      color: '#93c5fd',
      weight: 4,
      opacity: 0.95,
      dashArray: '8, 4',
      lineCap: 'round',
    });

    routeLayer.addLayer(polylineGlow);
    routeLayer.addLayer(polylineCore);

    // Start marker (Green circle)
    const startPoint = activeRoute.coordinates[0];
    const startIcon = L.divIcon({
      className: 'route-start-pin',
      html: `
        <div style="
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #10b981;
          border: 3px solid #ffffff;
          box-shadow: 0 0 12px rgba(16,185,129,0.8);
        "></div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    routeLayer.addLayer(L.marker(startPoint, { icon: startIcon }));

    // End marker (Blue circle)
    const endPoint = activeRoute.coordinates[activeRoute.coordinates.length - 1];
    const endIcon = L.divIcon({
      className: 'route-end-pin',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #3b82f6;
          border: 3px solid #ffffff;
          box-shadow: 0 0 14px rgba(59,130,246,0.9);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    routeLayer.addLayer(L.marker(endPoint, { icon: endIcon }));

    // Fit map bounds to route
    map.fitBounds(L.polyline(activeRoute.coordinates).getBounds(), {
      padding: [60, 60],
      maxZoom: 14,
    });
  }, [activeRoute]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map || incidents.length === 0) return;
    const bounds = L.latLngBounds(incidents.map((i) => [i.lat, i.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  };

  return (
    <div
      className={`relative w-full h-full min-h-[440px] rounded-[32px] overflow-hidden border border-white/15 bg-black ${className}`}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/80 hover:bg-black border border-white/20 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title="Fit incidents in view"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>Fit Alerts ({incidents.length})</span>
        </button>

        <button
          onClick={() => setTileMode((prev) => (prev === 'dark' ? 'standard' : 'dark'))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/80 hover:bg-black border border-white/20 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="capitalize">{tileMode} Map</span>
        </button>
      </div>

      {/* Map Legend Overlay (bottom-left) */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/85 border border-white/15 text-[11px] text-slate-300 backdrop-blur-md">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          Accident
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Road Hazard
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          Lighting
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          Community
        </span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <span>✓</span> Verified
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <span>?</span> Unverified
        </span>
      </div>
    </div>
  );
};
