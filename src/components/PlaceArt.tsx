import React from 'react';

interface PlaceArtProps {
  iconType: string;
  themeColor?: string;
  className?: string;
}

export const PlaceArt: React.FC<PlaceArtProps> = ({
  iconType,
  themeColor = 'from-blue-950/40 to-slate-900/30',
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full min-h-[170px] rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br ${themeColor} border border-white/10 ${className}`}
    >
      {/* Specular sheen over card top */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {iconType === 'tree' && (
        <svg viewBox="0 0 200 140" className="w-36 h-28 drop-shadow-xl" fill="none">
          <ellipse cx="100" cy="115" rx="60" ry="14" fill="#020617" fillOpacity="0.5" />
          {/* Glass Biome dome */}
          <path
            d="M 50 115 C 50 65, 150 65, 150 115 Z"
            fill="rgba(147, 197, 253, 0.2)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="2"
          />
          {/* Inner Lush Foliage */}
          <circle cx="85" cy="100" r="18" fill="#10b981" />
          <circle cx="115" cy="98" r="22" fill="#059669" />
          <circle cx="100" cy="85" r="16" fill="#34d399" />
          <ellipse cx="96" cy="80" rx="7" ry="3" fill="#ffffff" fillOpacity="0.6" />
          {/* Dome Ribs */}
          <path d="M 100 65 L 100 115" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
          <path d="M 75 75 C 80 90, 80 105, 80 115" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
          <path d="M 125 75 C 120 90, 120 105, 120 115" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
        </svg>
      )}

      {iconType === 'coffee' && (
        <svg viewBox="0 0 200 140" className="w-36 h-28 drop-shadow-xl" fill="none">
          <ellipse cx="100" cy="115" rx="65" ry="14" fill="#020617" fillOpacity="0.5" />
          {/* Rooftop Pergola / Terrace */}
          <rect x="55" y="60" width="90" height="8" rx="4" fill="#93c5fd" />
          <rect x="62" y="68" width="6" height="46" rx="3" fill="#64748b" />
          <rect x="132" y="68" width="6" height="46" rx="3" fill="#64748b" />
          {/* Warm Bistro Table */}
          <rect x="85" y="88" width="30" height="5" rx="2.5" fill="#e2e8f0" />
          <rect x="98" y="93" width="4" height="20" rx="2" fill="#94a3b8" />
          {/* Glowing Lantern */}
          <circle cx="100" cy="74" r="8" fill="#fef08a" fillOpacity="0.9" />
          <circle cx="100" cy="74" r="16" fill="#fef08a" fillOpacity="0.25" />
          {/* Skyline mini silhouette */}
          <rect x="40" y="80" width="12" height="30" rx="3" fill="#1e293b" />
          <rect x="148" y="75" width="14" height="35" rx="3" fill="#1e293b" />
        </svg>
      )}

      {iconType === 'clock' && (
        <svg viewBox="0 0 200 140" className="w-36 h-28 drop-shadow-xl" fill="none">
          <ellipse cx="100" cy="120" rx="60" ry="12" fill="#020617" fillOpacity="0.5" />
          {/* Clock Tower Masonry */}
          <path
            d="M 80 120 L 86 55 L 114 55 L 120 120 Z"
            fill="#cbd5e1"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.5"
          />
          {/* Spire Roof */}
          <path d="M 82 55 L 100 24 L 118 55 Z" fill="#3b82f6" />
          <circle cx="100" cy="24" r="3" fill="#fbbf24" />
          {/* Round Clock Face */}
          <circle cx="100" cy="72" r="14" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
          <circle cx="100" cy="72" r="2" fill="#0f172a" />
          <line x1="100" y1="72" x2="100" y2="64" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="100" y1="72" x2="106" y2="72" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}

      {iconType === 'bed' && (
        <svg viewBox="0 0 200 140" className="w-36 h-28 drop-shadow-xl" fill="none">
          <ellipse cx="100" cy="118" rx="60" ry="12" fill="#020617" fillOpacity="0.5" />
          {/* Glass Boutique Hotel Facade */}
          <rect
            x="65"
            y="45"
            width="70"
            height="70"
            rx="14"
            fill="linear-gradient(180deg, #93c5fd, #60a5fa)"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Illuminated Glass Windows */}
          <rect x="74" y="56" width="18" height="18" rx="6" fill="#ffffff" fillOpacity="0.75" />
          <rect x="108" y="56" width="18" height="18" rx="6" fill="#ffffff" fillOpacity="0.75" />
          <rect x="74" y="82" width="18" height="18" rx="6" fill="#ffffff" fillOpacity="0.75" />
          <rect x="108" y="82" width="18" height="18" rx="6" fill="#ffffff" fillOpacity="0.75" />
          {/* Boutique Entrance canopy */}
          <rect x="90" y="105" width="20" height="12" rx="4" fill="#1e293b" />
          <line x1="72" y1="46" x2="128" y2="46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {iconType === 'palette' && (
        <svg viewBox="0 0 200 140" className="w-36 h-28 drop-shadow-xl" fill="none">
          <ellipse cx="100" cy="115" rx="55" ry="12" fill="#020617" fillOpacity="0.5" />
          {/* Modern Art Sculptural Cubes */}
          <rect x="70" y="55" width="40" height="40" rx="10" fill="#818cf8" stroke="#ffffff" strokeWidth="1.5" />
          <rect x="92" y="70" width="45" height="42" rx="12" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="120" cy="52" r="14" fill="#fb7185" />
          <ellipse cx="116" cy="48" rx="5" ry="2.5" fill="#ffffff" fillOpacity="0.8" />
        </svg>
      )}

      {iconType === 'anchor' && (
        <svg viewBox="0 0 200 140" className="w-36 h-28 drop-shadow-xl" fill="none">
          <ellipse cx="100" cy="118" rx="65" ry="12" fill="#020617" fillOpacity="0.5" />
          {/* Pier Wooden Planks */}
          <rect x="50" y="105" width="100" height="8" rx="4" fill="#94a3b8" />
          {/* Sailboat silhouette in soft clay */}
          <path d="M 75 105 L 125 105 L 115 116 L 85 116 Z" fill="#0284c7" />
          <path d="M 100 102 L 100 52 L 120 102 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M 98 102 L 98 62 L 82 102 Z" fill="#93c5fd" />
        </svg>
      )}

      {iconType === 'sparkle' && (
        <svg viewBox="0 0 200 140" className="w-36 h-28 drop-shadow-xl" fill="none">
          <circle cx="100" cy="70" r="36" fill="#c084fc" fillOpacity="0.25" />
          <circle cx="100" cy="70" r="22" fill="#a855f7" />
          <path
            d="M 100 45 L 105 65 L 125 70 L 105 75 L 100 95 L 95 75 L 75 70 L 95 65 Z"
            fill="#ffffff"
          />
          <circle cx="70" cy="50" r="5" fill="#f472b6" />
          <circle cx="132" cy="85" r="4" fill="#60a5fa" />
        </svg>
      )}

      {iconType === 'mountain' && (
        <svg viewBox="0 0 200 140" className="w-36 h-28 drop-shadow-xl" fill="none">
          <ellipse cx="100" cy="118" rx="65" ry="12" fill="#020617" fillOpacity="0.5" />
          {/* Smooth Clay Peak */}
          <path d="M 50 115 L 95 45 L 140 115 Z" fill="#0d9488" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 105 115 L 135 65 L 165 115 Z" fill="#14b8a6" />
          {/* Snow Cap */}
          <path d="M 95 45 L 85 62 Q 95 58 105 62 Z" fill="#ffffff" />
          {/* Viewing telescope */}
          <circle cx="78" cy="110" r="3" fill="#f59e0b" />
          <line x1="78" y1="110" x2="72" y2="102" stroke="#f59e0b" strokeWidth="2" />
        </svg>
      )}
    </div>
  );
};
