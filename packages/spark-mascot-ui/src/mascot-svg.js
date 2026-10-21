export const mascotPalettes = {
  citrus: {
    body: "#ffd84d",
    bodyShade: "#ffb938",
    belly: "#fff6bf",
    accent: "#13b8a6",
    accentSoft: "#9bf4e7",
    ink: "#222733",
    blush: "#ff9f8a",
    cup: "#ffffff",
    cupBand: "#13b8a6"
  },
  berry: {
    body: "#ffcf5c",
    bodyShade: "#ff9d4d",
    belly: "#fff2cf",
    accent: "#7c5cff",
    accentSoft: "#d8ceff",
    ink: "#252235",
    blush: "#ff8fb1",
    cup: "#ffffff",
    cupBand: "#7c5cff"
  },
  mint: {
    body: "#a7f3d0",
    bodyShade: "#34d399",
    belly: "#ecfdf5",
    accent: "#facc15",
    accentSoft: "#fef3c7",
    ink: "#16332b",
    blush: "#fb7185",
    cup: "#ffffff",
    cupBand: "#22c55e"
  }
};

export const mascotPresets = {
  idle: {
    pose: "idle",
    accessory: "none",
    label: "Spark mascot waving"
  },
  coffee: {
    pose: "coffee",
    accessory: "coffee",
    label: "Spark mascot holding a coffee cup"
  },
  celebrate: {
    pose: "celebrate",
    accessory: "sparkles",
    label: "Spark mascot celebrating"
  },
  support: {
    pose: "support",
    accessory: "headset",
    label: "Spark mascot ready to help"
  }
};

const KNOWN_POSES = new Set(["idle", "coffee", "celebrate", "support"]);
const KNOWN_ACCESSORIES = new Set(["none", "coffee", "sparkles", "headset"]);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeChoice(value, fallback, knownValues) {
  const normalized = String(value || "").trim().toLowerCase();
  return knownValues.has(normalized) ? normalized : fallback;
}

function normalizePalette(name, accent) {
  const palette = mascotPalettes[name] || mascotPalettes.citrus;
  const safeAccent = normalizeColor(accent);
  return {
    ...palette,
    accent: safeAccent || palette.accent,
    cupBand: safeAccent || palette.cupBand
  };
}

function boolAttr(value) {
  return value === true || value === "" || value === "true" || value === "1";
}

function normalizeColor(value) {
  const color = String(value || "").trim();
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
  if (/^var\(--[a-z0-9-]+\)$/i.test(color)) return color;
  return "";
}

function normalizeId(value) {
  return String(value || "spark-mascot")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "spark-mascot";
}

function getAccessoryMarkup(accessory, palette) {
  if (accessory === "coffee") {
    return `
      <g class="coffee-cup" aria-hidden="true">
        <path class="steam steam-a" d="M142 94 C132 82 151 75 141 63" />
        <path class="steam steam-b" d="M164 92 C154 80 174 72 162 60" />
        <path class="steam steam-c" d="M185 96 C176 84 194 78 184 66" />
        <path d="M132 108 h66 l-8 60 c-1 8-8 14-16 14 h-22 c-8 0-15-6-16-14 l-8-60 z" fill="${palette.cup}" stroke="${palette.ink}" stroke-width="6" stroke-linejoin="round" />
        <path d="M132 124 h64 l-4 26 h-56 z" fill="${palette.cupBand}" opacity=".95" />
        <path d="M197 123 h13 c13 0 21 8 21 19 0 12-9 20-22 20 h-16" fill="none" stroke="${palette.ink}" stroke-width="7" stroke-linecap="round" />
        <path d="M153 132 h22" stroke="${palette.accentSoft}" stroke-width="5" stroke-linecap="round" opacity=".8" />
      </g>
    `;
  }

  if (accessory === "headset") {
    return `
      <g class="headset" aria-hidden="true">
        <path d="M82 135 C82 84 121 52 166 52 C211 52 250 84 250 135" fill="none" stroke="${palette.ink}" stroke-width="8" stroke-linecap="round" />
        <rect x="58" y="128" width="29" height="48" rx="14" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="6" />
        <rect x="245" y="128" width="29" height="48" rx="14" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="6" />
        <path d="M251 177 C246 202 224 213 198 213" fill="none" stroke="${palette.ink}" stroke-width="6" stroke-linecap="round" />
        <circle cx="194" cy="213" r="8" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="5" />
      </g>
    `;
  }

  return "";
}

function getPoseSparkles(accessory, palette) {
  const extraSparkles = accessory === "sparkles"
    ? `
      <path class="sparkle sparkle-extra-a" d="M279 142 l8 18 18 8-18 8-8 18-8-18-18-8 18-8z" fill="${palette.accent}" />
      <path class="sparkle sparkle-extra-b" d="M51 157 l6 13 13 6-13 6-6 13-6-13-13-6 13-6z" fill="${palette.accentSoft}" />
    `
    : "";

  return `
    <g class="sparkle-field" aria-hidden="true">
      <path class="sparkle sparkle-a" d="M254 54 l7 16 16 7-16 7-7 16-7-16-16-7 16-7z" fill="${palette.accent}" />
      <path class="sparkle sparkle-b" d="M58 83 l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" fill="${palette.accentSoft}" />
      ${extraSparkles}
    </g>
  `;
}

function getAnimationStyles() {
  return `
    .mascot-svg * { transform-box: fill-box; }
    .mascot-svg[data-animated="false"] * { animation: none !important; }
    .mascot-float { transform-origin: center; }
    .sparkle, .steam, .antenna-spark, .coffee-arm, .wave-arm, .headset { transform-origin: center; }
    .eye { transform-origin: center; }
    .mascot-svg[data-animated="true"] .mascot-float { animation: mascot-bob 2.8s ease-in-out infinite; }
    .mascot-svg[data-animated="true"] .shadow { animation: mascot-shadow 2.8s ease-in-out infinite; transform-origin: center; }
    .mascot-svg[data-animated="true"] .eye { animation: mascot-blink 4.8s infinite; }
    .mascot-svg[data-animated="true"] .antenna-spark { animation: mascot-spark-pop 1.8s ease-in-out infinite; }
    .mascot-svg[data-animated="true"] .sparkle-a { animation: mascot-twinkle 2.2s ease-in-out infinite; }
    .mascot-svg[data-animated="true"] .sparkle-b { animation: mascot-twinkle 2.4s ease-in-out .25s infinite; }
    .mascot-svg[data-animated="true"] .sparkle-extra-a { animation: mascot-twinkle 1.7s ease-in-out .1s infinite; }
    .mascot-svg[data-animated="true"] .sparkle-extra-b { animation: mascot-twinkle 1.9s ease-in-out .35s infinite; }
    .mascot-svg[data-animated="true"] .steam-a { animation: mascot-steam 2.2s ease-in-out infinite; }
    .mascot-svg[data-animated="true"] .steam-b { animation: mascot-steam 2.5s ease-in-out .25s infinite; }
    .mascot-svg[data-animated="true"] .steam-c { animation: mascot-steam 2.35s ease-in-out .5s infinite; }
    .mascot-svg[data-animated="true"] .coffee-arm { animation: mascot-hold 2.8s ease-in-out infinite; transform-origin: 117px 178px; }
    .mascot-svg[data-pose="idle"][data-animated="true"] .wave-arm { animation: mascot-wave 2s ease-in-out infinite; transform-origin: 226px 174px; }
    .mascot-svg[data-pose="celebrate"][data-animated="true"] .wave-arm { animation: mascot-cheer .9s ease-in-out infinite; transform-origin: 226px 174px; }

    @keyframes mascot-bob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-7px); }
    }
    @keyframes mascot-shadow {
      0%, 100% { transform: scaleX(1); opacity: .16; }
      50% { transform: scaleX(.88); opacity: .1; }
    }
    @keyframes mascot-blink {
      0%, 88%, 94%, 100% { transform: scaleY(1); }
      90%, 92% { transform: scaleY(.08); }
    }
    @keyframes mascot-spark-pop {
      0%, 100% { transform: scale(.92) rotate(0deg); opacity: .88; }
      50% { transform: scale(1.15) rotate(8deg); opacity: 1; }
    }
    @keyframes mascot-twinkle {
      0%, 100% { transform: scale(.72) rotate(0deg); opacity: .45; }
      50% { transform: scale(1.08) rotate(18deg); opacity: 1; }
    }
    @keyframes mascot-steam {
      0% { transform: translateY(9px) scale(.92); opacity: 0; }
      35% { opacity: .7; }
      100% { transform: translateY(-12px) scale(1.05); opacity: 0; }
    }
    @keyframes mascot-hold {
      0%, 100% { transform: rotate(-1deg); }
      50% { transform: rotate(2deg); }
    }
    @keyframes mascot-wave {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(14deg); }
    }
    @keyframes mascot-cheer {
      0%, 100% { transform: rotate(-11deg) translateY(0); }
      50% { transform: rotate(10deg) translateY(-7px); }
    }
  `;
}

export function createMascotSvg(options = {}) {
  const preset = mascotPresets[options.preset] || {};
  const pose = normalizeChoice(options.pose || preset.pose, "idle", KNOWN_POSES);
  const defaultAccessory = pose === "coffee" ? "coffee" : preset.accessory || "none";
  const accessory = normalizeChoice(options.accessory || defaultAccessory, defaultAccessory, KNOWN_ACCESSORIES);
  const palette = normalizePalette(options.palette || "citrus", options.accent);
  const label = escapeHtml(options.label || preset.label || "Spark mascot");
  const animated = boolAttr(options.animated ?? true);
  const includeStyles = options.includeStyles !== false;
  const idPrefix = normalizeId(options.idPrefix);
  const bodyGradientId = `${idPrefix}-body`;
  const shadowFilterId = `${idPrefix}-soft-shadow`;
  const rightArmClass = accessory === "coffee" ? "coffee-arm" : "wave-arm";
  const rightArmPath = accessory === "coffee"
    ? "M209 180 C238 166 253 145 259 123"
    : "M211 174 C239 153 253 127 250 98";
  const leftArmPath = pose === "celebrate"
    ? "M119 176 C92 151 82 127 88 103"
    : "M118 183 C96 185 81 197 72 219";

  return `
    <svg class="mascot-svg" data-pose="${pose}" data-animated="${animated}" viewBox="0 0 320 320" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
      ${includeStyles ? `<style>${getAnimationStyles()}</style>` : ""}
      <defs>
        <linearGradient id="${bodyGradientId}" x1="93" y1="64" x2="231" y2="260" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette.body}" />
          <stop offset="1" stop-color="${palette.bodyShade}" />
        </linearGradient>
        <filter id="${shadowFilterId}" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#1f2937" flood-opacity=".16" />
        </filter>
      </defs>

      <ellipse class="shadow" cx="160" cy="286" rx="84" ry="18" fill="#1f2937" opacity=".16" />
      ${getPoseSparkles(accessory, palette)}

      <g class="mascot-float" filter="url(#${shadowFilterId})">
        <path d="M134 58 C139 35 155 22 174 21 C187 37 186 55 171 75" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M192 67 C204 45 222 36 241 41 C248 61 240 78 218 88" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <path class="antenna-spark" d="M170 30 l8 17 17 8-17 8-8 17-8-17-17-8 17-8z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="5" stroke-linejoin="round" />

        <path d="M83 160 C83 99 119 63 164 63 C215 63 248 103 248 164 C248 231 213 273 161 273 C109 273 83 231 83 160 z" fill="url(#${bodyGradientId})" stroke="${palette.ink}" stroke-width="8" stroke-linejoin="round" />
        <path d="M117 185 C119 148 139 128 163 128 C191 128 211 152 210 188 C209 229 190 251 162 251 C132 251 115 225 117 185 z" fill="${palette.belly}" opacity=".88" />
        <path d="M153 162 l20 4-17 24 24 5-36 42 11-31-24-5z" fill="${palette.accent}" opacity=".98" stroke="${palette.ink}" stroke-width="4" stroke-linejoin="round" />

        <path d="${leftArmPath}" fill="none" stroke="${palette.ink}" stroke-width="15" stroke-linecap="round" />
        <path d="${rightArmPath}" class="${rightArmClass}" fill="none" stroke="${palette.ink}" stroke-width="15" stroke-linecap="round" />
        ${getAccessoryMarkup(accessory, palette)}

        <ellipse class="eye" cx="137" cy="143" rx="10" ry="13" fill="${palette.ink}" />
        <ellipse class="eye" cx="186" cy="143" rx="10" ry="13" fill="${palette.ink}" />
        <circle cx="141" cy="138" r="3" fill="#ffffff" opacity=".9" />
        <circle cx="190" cy="138" r="3" fill="#ffffff" opacity=".9" />
        <path d="M145 174 C154 184 170 184 180 174" fill="none" stroke="${palette.ink}" stroke-width="6" stroke-linecap="round" />
        <ellipse cx="111" cy="163" rx="13" ry="8" fill="${palette.blush}" opacity=".55" />
        <ellipse cx="211" cy="163" rx="13" ry="8" fill="${palette.blush}" opacity=".55" />

        <path d="M123 263 C111 277 91 276 85 263 C94 255 109 252 123 263 z" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="6" stroke-linejoin="round" />
        <path d="M197 263 C209 277 229 276 235 263 C226 255 211 252 197 263 z" fill="${palette.accentSoft}" stroke="${palette.ink}" stroke-width="6" stroke-linejoin="round" />
      </g>
    </svg>
  `;
}
