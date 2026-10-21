import React from 'react';

export default function C2cAnimation() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>
            {`
              @keyframes character-float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
              }
              @keyframes pop {
                0%, 100% { transform: scale(1) translateY(0); opacity: 0.8; }
                50% { transform: scale(1.15) translateY(-15px); opacity: 1; }
              }
              @keyframes leaf-sway {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(4deg); }
              }
              .char-anim { animation: character-float 4s infinite ease-in-out; transform-origin: center; transform-box: fill-box; }
              .coin1 { animation: pop 2.5s infinite ease-in-out 0s; transform-origin: center; transform-box: fill-box; }
              .coin2 { animation: pop 3s infinite ease-in-out 0.5s; transform-origin: center; transform-box: fill-box; }
              .coin3 { animation: pop 2.8s infinite ease-in-out 1s; transform-origin: center; transform-box: fill-box; }
              .leaf { animation: leaf-sway 6s infinite ease-in-out; transform-origin: bottom center; transform-box: fill-box; }

              @media (prefers-reduced-motion: reduce) {
                .char-anim, .coin1, .coin2, .coin3, .leaf { animation: none !important; }
              }
            `}
          </style>

          <filter id="c2c-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#9A3412" floodOpacity="0.1" />
          </filter>

          <g id="coin-gold">
            <circle cx="15" cy="15" r="15" fill="#FBBF24" />
            <circle cx="15" cy="15" r="11" fill="#F59E0B" />
            <text x="15" y="20" fontSize="14" fill="#FEF3C7" textAnchor="middle" fontWeight="bold">$</text>
          </g>
        </defs>

        {/* Abstract shapes for home vibe */}
        <path d="M 0 300 Q 400 450 800 300 L 800 600 L 0 600 Z" fill="#FDE68A" opacity="0.2" />
        <circle cx="200" cy="200" r="120" fill="#FFEDD5" opacity="0.4" />
        <circle cx="600" cy="450" r="180" fill="#FED7AA" opacity="0.3" />
        
        {/* Window */}
        <rect x="120" y="100" width="160" height="200" rx="8" fill="#BAE6FD" opacity="0.4" />
        <path d="M 120 200 L 280 200 M 200 100 L 200 300" stroke="#FFFFFF" strokeWidth="6" fill="none" />

        {/* Plant */}
        <g transform="translate(620, 360)">
          <path d="M 0 150 L 0 80" stroke="#064E3B" strokeWidth="8" fill="none" />
          <path className="leaf" d="M 0 120 Q -40 100 0 60 Q 20 80 0 120 Z" fill="#10B981" />
          <path className="leaf" style={{ animationDelay: "1s" }} d="M 0 100 Q 40 70 0 20 Q -20 50 0 100 Z" fill="#059669" />
          <path className="leaf" style={{ animationDelay: "2s" }} d="M 0 80 Q -30 30 10 -10 Q 30 20 0 80 Z" fill="#34D399" />
          <path d="M -30 150 L 30 150 L 20 220 L -20 220 Z" fill="#B45309" />
        </g>

        {/* Sofa */}
        <rect x="250" y="320" width="300" height="80" rx="20" fill="#F472B6" />
        <rect x="230" y="280" width="40" height="120" rx="15" fill="#EC4899" />
        <rect x="530" y="280" width="40" height="120" rx="15" fill="#EC4899" />
        <rect x="270" y="240" width="260" height="100" rx="20" fill="#F9A8D4" />
        
        {/* Shadow under sofa */}
        <ellipse cx="400" cy="420" rx="180" ry="15" fill="#9A3412" opacity="0.1" />

        {/* Character on sofa */}
        <g className="char-anim" transform="translate(360, 160)" filter="url(#c2c-shadow)">
          {/* Legs */}
          <path d="M 40 180 L 40 240 L 70 240" stroke="#1E3A8A" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          
          {/* Body */}
          <rect x="20" y="80" width="60" height="110" rx="25" fill="#3B82F6" />
          
          {/* Head */}
          <circle cx="50" cy="40" r="35" fill="#FDBA74" />
          {/* Hair */}
          <path d="M 15 40 C 15 10 85 10 85 40 C 85 60 70 70 70 70 L 60 40 Z" fill="#1F2937" />
          
          {/* Face */}
          <circle cx="40" cy="45" r="4" fill="#1F2937" />
          <circle cx="65" cy="45" r="4" fill="#1F2937" />
          <path d="M 45 55 Q 52 65 60 55" stroke="#1F2937" strokeWidth="2" fill="none" />
          
          {/* Arms & Laptop */}
          <path d="M 30 100 L 70 140" stroke="#FDBA74" strokeWidth="14" strokeLinecap="round" fill="none" />
          
          {/* Laptop on lap */}
          <path d="M 70 160 L 130 160" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round" />
          <path d="M 125 160 L 95 110" stroke="#D1D5DB" strokeWidth="8" strokeLinecap="round" />
          <rect x="95" y="110" width="30" height="50" fill="#E5E7EB" transform="skewX(30)" />
        </g>

        {/* Profit / Coins Popping */}
        <use href="#coin-gold" x="480" y="140" className="coin1" />
        <use href="#coin-gold" x="550" y="200" className="coin2" />
        <use href="#coin-gold" x="520" y="80" className="coin3" />

        {/* Packed Boxes on the floor */}
        <g transform="translate(180, 420)">
          <path d="M 0 20 L 30 5 L 60 20 L 60 50 L 30 65 L 0 50 Z" fill="#FCD34D" />
          <path d="M 30 5 L 30 35 L 60 20 M 0 20 L 30 35 M 30 35 L 30 65" stroke="#D97706" strokeWidth="2" fill="none" />
          <polygon points="15,12 45,27 30,35 0,20" fill="#FEF3C7" opacity="0.6" />
        </g>
        <g transform="translate(250, 440) scale(0.8)">
          <path d="M 0 20 L 30 5 L 60 20 L 60 50 L 30 65 L 0 50 Z" fill="#FCD34D" />
          <path d="M 30 5 L 30 35 L 60 20 M 0 20 L 30 35 M 30 35 L 30 65" stroke="#D97706" strokeWidth="2" fill="none" />
          <polygon points="15,12 45,27 30,35 0,20" fill="#FEF3C7" opacity="0.6" />
        </g>

      </svg>
    </div>
  );
}
