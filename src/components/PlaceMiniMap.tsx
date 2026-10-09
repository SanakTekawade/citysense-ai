import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PlaceItem } from '../data/cityData';

interface PlaceMiniMapProps {
  place: PlaceItem;
  className?: string;
}

export const PlaceMiniMap: React.FC<PlaceMiniMapProps> = ({ place, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(containerRef.current, {
        center: [place.lat, place.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Custom Glowing Place Pin
      const icon = L.divIcon({
        className: 'place-details-pin',
        html: `
          <div style="
            position: relative;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 9999px;
              background: linear-gradient(180deg, #93c5fd, #3b82f6);
              border: 3px solid #ffffff;
              box-shadow: 0 0 25px rgba(59,130,246,0.9), 0 8px 16px rgba(0,0,0,0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0f172a;
              font-weight: 800;
              font-size: 13px;
            ">
              ★
            </div>
            <div style="
              position: absolute;
              width: 70px;
              height: 70px;
              border-radius: 9999px;
              background: rgba(59,130,246,0.2);
              animation: pulse 2s infinite;
              pointer-events: none;
            "></div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      L.marker([place.lat, place.lng], { icon }).addTo(map);

      // Add a subtle perimeter radius circle
      L.circle([place.lat, place.lng], {
        radius: 300,
        color: '#60a5fa',
        weight: 1.5,
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        dashArray: '4, 4',
      }).addTo(map);

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.error('Error initializing PlaceMiniMap:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [place]);

  return (
    <div
      className={`relative w-full h-full min-h-[220px] rounded-2xl overflow-hidden border border-white/15 bg-black ${className}`}
    >
      <div ref={containerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-black/80 border border-white/15 text-[10px] text-slate-400 backdrop-blur-md">
        Coordinates: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
      </div>
    </div>
  );
};
