import React from 'react';

export default function RetailerAnimation() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>
            {`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              @keyframes chart-grow {
                0% { transform: scaleY(0); }
                100% { transform: scaleY(1); }
              }
              .char-anim { animation: bounce 3s infinite ease-in-out; transform-origin: bottom center; transform-box: fill-box; }
              .chart-bar { animation: chart-grow 1.5s ease-out forwards; transform-origin: bottom; }
              .coin { animation: bounce 2.5s infinite ease-in-out; transform-origin: center; transform-box: fill-box; }
              .coin2 { animation: bounce 3s infinite ease-in-out; transform-origin: center; transform-box: fill-box; }
              .coin3 { animation: bounce 2.2s infinite ease-in-out; transform-origin: center; transform-box: fill-box; }

              @media (prefers-reduced-motion: reduce) {
                .char-anim, .chart-bar, .coin, .coin2, .coin3 { animation: none !important; }
              }
            `}
          </style>

          <filter id="retail-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#4338CA" floodOpacity="0.15" />
          </filter>

          <g id="coin-purple">
            <circle cx="15" cy="15" r="15" fill="#FBBF24" />
            <circle cx="15" cy="15" r="11" fill="#F59E0B" />
            <text x="15" y="20" fontSize="14" fill="#FEF3C7" textAnchor="middle" fontWeight="bold">$</text>
          </g>
        </defs>

        {/* Abstract Background */}
        <circle cx="700" cy="150" r="250" fill="#C7D2FE" opacity="0.3" />
        <circle cx="100" cy="500" r="200" fill="#DDD6FE" opacity="0.4" />
        <path d="M 0 450 L 800 350 L 800 600 L 0 600 Z" fill="#818CF8" opacity="0.1" />

        {/* Shop Awning */}
        <path d="M 150 100 L 650 100 L 680 180 L 120 180 Z" fill="#4F46E5" />
        <path d="M 120 180 Q 155 210 190 180 Q 225 210 260 180 Q 295 210 330 180 Q 365 210 400 180 Q 435 210 470 180 Q 505 210 540 180 Q 575 210 610 180 Q 645 210 680 180 Z" fill="#4338CA" />

        {/* Shop Counter */}
        <rect x="180" y="380" width="440" height="150" rx="8" fill="#8B5CF6" filter="url(#retail-shadow)" />
        <rect x="160" y="360" width="480" height="30" rx="5" fill="#A78BFA" />

        {/* Point of Sale / Cash Register */}
        <rect x="220" y="300" width="80" height="60" rx="5" fill="#475569" />
        <rect x="230" y="280" width="60" height="40" rx="4" fill="#94A3B8" />
        <path d="M 235 285 L 285 285 L 285 315 L 235 315 Z" fill="#F8FAFC" />
        <rect x="240" y="290" width="40" height="20" rx="2" fill="#38BDF8" />

        {/* Profit Chart on Wall */}
        <rect x="520" y="200" width="100" height="120" rx="8" fill="#FFFFFF" opacity="0.9" />
        <rect className="chart-bar" x="535" y="280" width="15" height="30" fill="#34D399" />
        <rect className="chart-bar" style={{ animationDelay: "0.2s" }} x="560" y="260" width="15" height="50" fill="#10B981" />
        <rect className="chart-bar" style={{ animationDelay: "0.4s" }} x="585" y="220" width="15" height="90" fill="#059669" />

        {/* Character (Professional Retailer) */}
        <g className="char-anim" transform="translate(350, 160)" filter="url(#retail-shadow)">
          {/* Body */}
          <path d="M 20 200 L 20 80 Q 50 60 80 80 L 80 200 Z" fill="#6366F1" />
          {/* Collar/Tie */}
          <path d="M 40 80 L 50 100 L 60 80 Z" fill="#FFFFFF" />
          <path d="M 48 100 L 52 100 L 54 130 L 50 140 L 46 130 Z" fill="#DC2626" />
          {/* Head */}
          <circle cx="50" cy="40" r="32" fill="#FDBA74" />
          {/* Hair */}
          <path d="M 15 40 Q 15 5 50 5 Q 85 5 85 40 L 80 40 Q 80 15 50 15 Q 20 15 20 40 Z" fill="#1E293B" />
          <path d="M 15 40 L 25 20 L 35 30 Z" fill="#1E293B" />
          {/* Face */}
          <circle cx="38" cy="42" r="4" fill="#1E293B" />
          <circle cx="62" cy="42" r="4" fill="#1E293B" />
          {/* Smile */}
          <path d="M 40 55 Q 50 65 60 55 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />

          {/* Arms holding a product */}
          <path d="M 25 90 Q -10 130 30 160" stroke="#4F46E5" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M 75 90 Q 110 130 70 160" stroke="#4F46E5" strokeWidth="16" strokeLinecap="round" fill="none" />
          {/* Hands */}
          <circle cx="30" cy="160" r="10" fill="#FDBA74" />
          <circle cx="70" cy="160" r="10" fill="#FDBA74" />

          {/* Product box being held */}
          <rect x="35" y="130" width="30" height="40" rx="4" fill="#F43F5E" />
          <path d="M 35 150 L 65 150" stroke="#FDA4AF" strokeWidth="4" />
          <circle cx="50" cy="160" r="6" fill="#FDA4AF" />
        </g>

        {/* Floating coins indicating sales */}
        <use href="#coin-purple" x="250" y="200" className="coin" style={{ animationDelay: "0s" }} />
        <use href="#coin-purple" x="480" y="160" className="coin2" style={{ animationDelay: "0.5s" }} />
        <use href="#coin-purple" x="650" y="250" className="coin3" style={{ animationDelay: "1s" }} />

      </svg>
    </div>
  );
}
