import React from 'react';

export const CityClayIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient soft glow aura */}
      <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

      <svg
        viewBox="0 0 520 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[480px] drop-shadow-2xl"
      >
        <defs>
          {/* Soft Clay Gradients */}
          <linearGradient id="clayBuilding1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="clayBuilding2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="clayBuilding3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <linearGradient id="clayGround" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="clayRoad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="clayTree" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <linearGradient id="glassPin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#60a5fa" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>

          {/* Soft Filter for Clay Drop Shadows */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
          </filter>

          <filter id="clayHighlight" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="-2" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Floating Base Island (Claymorphic rounded podium) */}
        <g filter="url(#softShadow)">
          <path
            d="M 60 210 C 60 180, 460 180, 460 210 C 460 270, 60 270, 60 210 Z"
            fill="url(#clayGround)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />
          {/* Subtle 3D Depth Under Island */}
          <path
            d="M 60 210 C 60 250, 460 250, 460 210 L 460 225 C 460 275, 60 275, 60 225 Z"
            fill="#090d16"
          />
        </g>

        {/* Curving Clay Road / Trail */}
        <path
          d="M 120 225 C 190 200, 240 240, 340 215 C 390 200, 420 215, 430 220"
          stroke="url(#clayRoad)"
          strokeWidth="24"
          strokeLinecap="round"
        />
        {/* Road center dashes */}
        <path
          d="M 130 223 C 195 200, 245 238, 340 214 C 385 201, 410 214, 420 218"
          stroke="#93c5fd"
          strokeWidth="2.5"
          strokeDasharray="8 8"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />

        {/* Left Clay Building (White / Cream Minimalist rounded tower) */}
        <g filter="url(#softShadow)">
          <rect
            x="110"
            y="110"
            width="56"
            height="100"
            rx="18"
            fill="url(#clayBuilding2)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.2"
          />
          {/* Windows (pill slots) */}
          <rect x="122" y="128" width="12" height="18" rx="6" fill="#1e293b" fillOpacity="0.25" />
          <rect x="142" y="128" width="12" height="18" rx="6" fill="#1e293b" fillOpacity="0.25" />
          <rect x="122" y="156" width="12" height="18" rx="6" fill="#1e293b" fillOpacity="0.25" />
          <rect x="142" y="156" width="12" height="18" rx="6" fill="#1e293b" fillOpacity="0.25" />
          {/* Specular edge top light */}
          <line x1="120" y1="112" x2="156" y2="112" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Central Dominant Clay Skyscraper (Liquid Blue Glass & Clay) */}
        <g filter="url(#softShadow)">
          <rect
            x="180"
            y="65"
            width="78"
            height="150"
            rx="24"
            fill="url(#clayBuilding1)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
          />
          {/* Top specular highlight rim */}
          <path
            d="M 194 67 Q 219 65 244 67"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Internal glass floor partitions */}
          <rect x="194" y="90" width="50" height="14" rx="7" fill="#ffffff" fillOpacity="0.3" />
          <rect x="194" y="114" width="50" height="14" rx="7" fill="#ffffff" fillOpacity="0.3" />
          <rect x="194" y="138" width="50" height="14" rx="7" fill="#ffffff" fillOpacity="0.3" />
          <rect x="194" y="162" width="50" height="14" rx="7" fill="#ffffff" fillOpacity="0.3" />
          {/* Vertical glossy light reflection */}
          <path
            d="M 188 78 L 188 195"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
        </g>

        {/* Right Modern Clay Building (Curved organic arc) */}
        <g filter="url(#softShadow)">
          <rect
            x="272"
            y="125"
            width="64"
            height="85"
            rx="20"
            fill="url(#clayBuilding3)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
          />
          <line x1="284" y1="127" x2="324" y2="127" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="286" y="142" width="36" height="20" rx="10" fill="#ffffff" fillOpacity="0.25" />
          <rect x="286" y="170" width="36" height="20" rx="10" fill="#ffffff" fillOpacity="0.25" />
        </g>

        {/* Far Right Soft Clay Observatory Dome */}
        <g filter="url(#softShadow)">
          <ellipse
            cx="375"
            cy="195"
            rx="36"
            ry="28"
            fill="url(#clayBuilding2)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.2"
          />
          <circle cx="375" cy="182" r="14" fill="url(#clayBuilding1)" />
          <ellipse cx="375" cy="178" rx="8" ry="4" fill="#ffffff" fillOpacity="0.7" />
        </g>

        {/* Rounded Clay Trees (Cute pill foliage) */}
        {/* Tree 1 */}
        <g filter="url(#softShadow)">
          <rect x="92" y="195" width="8" height="18" rx="4" fill="#64748b" />
          <circle cx="96" cy="188" r="16" fill="url(#clayTree)" />
          <ellipse cx="94" cy="182" rx="7" ry="4" fill="#ffffff" fillOpacity="0.5" />
        </g>
        {/* Tree 2 */}
        <g filter="url(#softShadow)">
          <rect x="345" y="202" width="6" height="16" rx="3" fill="#64748b" />
          <circle cx="348" cy="196" r="14" fill="url(#clayTree)" />
          <ellipse cx="346" cy="191" rx="6" ry="3" fill="#ffffff" fillOpacity="0.5" />
        </g>
        {/* Tree 3 */}
        <g filter="url(#softShadow)">
          <rect x="425" y="206" width="6" height="14" rx="3" fill="#64748b" />
          <circle cx="428" cy="200" r="12" fill="url(#clayTree)" />
          <ellipse cx="426" cy="196" rx="5" ry="3" fill="#ffffff" fillOpacity="0.5" />
        </g>

        {/* Floating CitySense Map Pin (Pill / Droplet with liquid glass jewel) */}
        <g filter="url(#softShadow)">
          {/* Pulsing beacon waves */}
          <circle cx="260" cy="48" r="32" fill="#60a5fa" fillOpacity="0.12" />
          <circle cx="260" cy="48" r="24" fill="#60a5fa" fillOpacity="0.2" />

          {/* Liquid Pin Body */}
          <path
            d="M 260 84 C 248 70, 238 56, 238 44 C 238 31.85, 247.85 22, 260 22 C 272.15 22, 282 31.85, 282 44 C 282 56, 272 70, 260 84 Z"
            fill="url(#glassPin)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          {/* Inner jewel circle */}
          <circle cx="260" cy="44" r="9" fill="#ffffff" />
          <circle cx="260" cy="44" r="5" fill="#1e3a8a" />
          {/* Specular highlight glint */}
          <ellipse cx="254" cy="34" rx="4" ry="2" fill="#ffffff" fillOpacity="0.9" />
        </g>

        {/* Floating Soft 3D Clay Clouds */}
        <g filter="url(#softShadow)">
          {/* Left Cloud */}
          <path
            d="M 80 85 Q 92 70 110 75 Q 128 72 135 88 Q 144 98 132 105 Q 115 108 95 104 Q 76 100 80 85 Z"
            fill="url(#cloudGrad)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          {/* Right Cloud */}
          <path
            d="M 390 95 Q 405 80 422 84 Q 440 82 446 96 Q 455 106 442 114 Q 425 116 405 112 Q 386 108 390 95 Z"
            fill="url(#cloudGrad)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
        </g>

        {/* Miniature Clay Electric Scooter / Mobility marker */}
        <g filter="url(#softShadow)">
          <ellipse cx="280" cy="232" rx="14" ry="4" fill="#020617" fillOpacity="0.6" />
          <rect x="272" y="222" width="16" height="5" rx="2.5" fill="#93c5fd" />
          <circle cx="272" cy="227" r="3.5" fill="#3b82f6" />
          <circle cx="288" cy="227" r="3.5" fill="#3b82f6" />
          <line x1="286" y1="222" x2="284" y2="212" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="281" y1="212" x2="287" y2="212" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
