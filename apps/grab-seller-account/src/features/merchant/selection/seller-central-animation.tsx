export default function SellerCentralAnimation() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
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
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-8px) rotate(1deg); }
              }
              @keyframes fly1 {
                0% { transform: translate(-100px, 400px) scale(0.5) rotate(-20deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(900px, 100px) scale(1) rotate(45deg); opacity: 0; }
              }
              @keyframes fly2 {
                0% { transform: translate(900px, 500px) scale(0.8) rotate(10deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(-100px, 150px) scale(1.2) rotate(-30deg); opacity: 0; }
              }
              @keyframes fly3 {
                0% { transform: translate(200px, 700px) scale(0.6) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(600px, -100px) scale(0.9) rotate(60deg); opacity: 0; }
              }
              @keyframes coin-bounce {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-25px) scale(1.1); }
              }
              @keyframes sparkle {
                0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.45; }
                50% { transform: scale(1.15) rotate(12deg); opacity: 1; }
              }
              .pkg1 { animation: fly1 10s infinite linear; }
              .pkg2 { animation: fly2 12s infinite linear 2s; }
              .pkg3 { animation: fly3 8s infinite linear 4s; }
              .character {
                animation: character-float 5s infinite ease-in-out;
                transform-box: fill-box;
                transform-origin: center;
              }
              .sparkle1, .sparkle2 {
                animation: sparkle 2.4s infinite ease-in-out;
                transform-box: fill-box;
                transform-origin: center;
              }
              .sparkle2 { animation-delay: 0.8s; }
              .coin1 { animation: coin-bounce 3s infinite ease-in-out 0.2s; }
              .coin2 { animation: coin-bounce 3.5s infinite ease-in-out 0.8s; }
              .coin3 { animation: coin-bounce 4s infinite ease-in-out 1.5s; }
              .coin4 { animation: coin-bounce 3.2s infinite ease-in-out 2.1s; }

              @media (prefers-reduced-motion: reduce) {
                .pkg1, .pkg2, .pkg3, .character,
                .sparkle1, .sparkle2,
                .coin1, .coin2, .coin3, .coin4 {
                  animation: none !important;
                }
                .pkg1, .pkg2, .pkg3 { display: none; }
              }
            `}
          </style>

          <filter id="character-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="7"
              floodColor="#065F46"
              floodOpacity="0.14"
            />
          </filter>

          <g id="box">
            <path d="M0,20 L30,5 L60,20 L60,50 L30,65 L0,50 Z" fill="#FCD34D" />
            <path d="M30,5 L30,35 L60,20 M0,20 L30,35 M30,35 L30,65" stroke="#D97706" strokeWidth="2" fill="none" />
            <polygon points="15,12 45,27 30,35 0,20" fill="#FEF3C7" opacity="0.6" />
          </g>

          {/* Coin definition */}
          <g id="coin">
            <circle cx="15" cy="15" r="15" fill="#FBBF24" />
            <circle cx="15" cy="15" r="11" fill="#F59E0B" />
            <text x="15" y="20" fontSize="14" fill="#FEF3C7" textAnchor="middle" fontWeight="bold">$</text>
          </g>
        </defs>

        <circle cx="150" cy="150" r="200" fill="#34D399" opacity="0.15" />
        <circle cx="650" cy="450" r="250" fill="#10B981" opacity="0.1" />
        <circle cx="700" cy="100" r="150" fill="#059669" opacity="0.05" />

        {/* Chart going up representing profit */}
        <g transform="translate(185, 300)" filter="url(#character-shadow)">
          <rect x="0" y="0" width="92" height="74" rx="14" fill="#FFFFFF" opacity="0.96" />
          <path d="M 18 55 L 34 39 L 49 46 L 72 20" stroke="#10B981" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="72" cy="20" r="5" fill="#059669" />
          <path d="M 18 55 L 74 55" stroke="#D1FAE5" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 18 55 L 18 18" stroke="#D1FAE5" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>

        {/* Character (Happy User) */}
        <ellipse cx="400" cy="455" rx="88" ry="18" fill="#065F46" opacity="0.12" />
        <g transform="translate(280, 155)">
          <g className="character" filter="url(#character-shadow)">
            {/* Raised arms */}
            <path d="M 78 188 C 48 178 34 151 31 122" stroke="#047857" strokeWidth="24" fill="none" strokeLinecap="round" />
            <path d="M 162 188 C 192 178 206 151 209 122" stroke="#047857" strokeWidth="24" fill="none" strokeLinecap="round" />
            <path d="M 31 122 C 25 106 24 91 29 76" stroke="#FDBA74" strokeWidth="15" fill="none" strokeLinecap="round" />
            <path d="M 209 122 C 215 106 216 91 211 76" stroke="#FDBA74" strokeWidth="15" fill="none" strokeLinecap="round" />

            {/* Open hands and fingers */}
            <circle cx="29" cy="68" r="13" fill="#FDBA74" />
            <circle cx="211" cy="68" r="13" fill="#FDBA74" />
            <path d="M 21 60 L 15 49 M 27 56 L 25 43 M 34 57 L 38 45" stroke="#FDBA74" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 219 60 L 225 49 M 213 56 L 215 43 M 206 57 L 202 45" stroke="#FDBA74" strokeWidth="6" fill="none" strokeLinecap="round" />

            {/* Torso */}
            <path d="M 58 260 C 61 204 76 174 101 164 L 139 164 C 164 174 179 204 182 260 Z" fill="#047857" />
            <path d="M 83 183 C 96 174 105 170 120 170 C 135 170 144 174 157 183 L 151 260 L 89 260 Z" fill="#10B981" opacity="0.72" />
            <path d="M 101 166 Q 120 187 139 166" stroke="#A7F3D0" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />

            {/* Neck */}
            <rect x="105" y="139" width="30" height="36" rx="14" fill="#F59E66" />

            {/* Hair behind the face */}
            <path d="M 58 94 C 55 47 78 18 119 15 C 160 14 185 44 181 96 C 177 129 157 153 120 156 C 82 153 62 129 58 94 Z" fill="#3F2A24" />

            {/* Ears and face */}
            <ellipse cx="61" cy="99" rx="13" ry="18" fill="#F59E66" />
            <ellipse cx="179" cy="99" rx="13" ry="18" fill="#F59E66" />
            <ellipse cx="120" cy="94" rx="57" ry="65" fill="#FDBA74" />

            {/* Soft layered hairstyle */}
            <path d="M 65 79 C 66 43 89 20 121 20 C 113 47 92 71 65 79 Z" fill="#4B3028" />
            <path d="M 117 20 C 151 21 175 43 178 78 C 150 75 129 57 117 20 Z" fill="#55372D" />
            <path d="M 63 78 C 56 98 61 121 72 136 C 65 121 69 101 79 86 Z" fill="#3F2A24" />
            <path d="M 177 78 C 184 98 179 121 168 136 C 175 121 171 101 161 86 Z" fill="#3F2A24" />

            {/* Brows */}
            <path d="M 87 84 Q 98 77 108 84" stroke="#6B3528" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 132 84 Q 142 77 153 84" stroke="#6B3528" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Bright eyes */}
            <ellipse cx="99" cy="99" rx="6" ry="8" fill="#3F2A24" />
            <ellipse cx="141" cy="99" rx="6" ry="8" fill="#3F2A24" />
            <circle cx="101" cy="96" r="2" fill="#FFFFFF" />
            <circle cx="143" cy="96" r="2" fill="#FFFFFF" />

            {/* Cheeks, nose and smile */}
            <ellipse cx="84" cy="115" rx="10" ry="6" fill="#FB7185" opacity="0.28" />
            <ellipse cx="156" cy="115" rx="10" ry="6" fill="#FB7185" opacity="0.28" />
            <path d="M 120 100 Q 116 111 121 113" stroke="#D97745" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 99 120 Q 120 143 141 120 Q 120 153 99 120 Z" fill="#9A3412" />
            <path d="M 107 125 Q 120 132 133 125" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>

          {/* Celebration sparkles */}
          <path className="sparkle1" d="M 8 20 L 12 31 L 23 35 L 12 39 L 8 50 L 4 39 L -7 35 L 4 31 Z" fill="#FBBF24" />
          <path className="sparkle2" d="M 232 14 L 236 24 L 246 28 L 236 32 L 232 42 L 228 32 L 218 28 L 228 24 Z" fill="#34D399" />
        </g>

        <use href="#coin" x="250" y="100" className="coin1" />
        <use href="#coin" x="520" y="180" className="coin2" />
        <use href="#coin" x="430" y="70" className="coin3" />
        <use href="#coin" x="180" y="320" className="coin4" />
        <use href="#coin" x="550" y="380" className="coin1" />

        <use href="#box" className="pkg1" />
        <use href="#box" className="pkg2" />
        <use href="#box" className="pkg3" />
        
      </svg>
    </div>
  );
}
