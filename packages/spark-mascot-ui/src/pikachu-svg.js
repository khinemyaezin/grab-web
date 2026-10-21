export const pikachuPalettes = {
  classic: {
    body: "#f5d010",
    bodyHighlight: "#ffe44d",
    bodyShade: "#d4a800",
    cheek: "#e8352b",
    earTip: "#1a1a1a",
    stripe: "#8b4513",
    ink: "#1f1f1f",
    tongue: "#e8637c",
    mouthInterior: "#c9506a",
    eyeHighlight: "#ffffff",
    cup: "#ffffff",
    cupBand: "#8b4513",
    tear: "#6bb8e8",
    accent: "#e8352b"
  },
  sunset: {
    body: "#ffc93c",
    bodyHighlight: "#ffe08a",
    bodyShade: "#e89b1c",
    cheek: "#ff6b6b",
    earTip: "#2d1b0e",
    stripe: "#a0522d",
    ink: "#2d1b0e",
    tongue: "#ff8fab",
    mouthInterior: "#d45d7a",
    eyeHighlight: "#ffffff",
    cup: "#ffffff",
    cupBand: "#ff6b6b",
    tear: "#74c0fc",
    accent: "#ff6b6b"
  },
  pastel: {
    body: "#fff176",
    bodyHighlight: "#fff9c4",
    bodyShade: "#f9d342",
    cheek: "#ff8a80",
    earTip: "#424242",
    stripe: "#bcaaa4",
    ink: "#424242",
    tongue: "#f48fb1",
    mouthInterior: "#e57373",
    eyeHighlight: "#ffffff",
    cup: "#ffffff",
    cupBand: "#81c784",
    tear: "#90caf9",
    accent: "#81c784"
  }
};

export const pikachuPresets = {
  idle: {
    pose: "idle",
    accessory: "none",
    emotion: "happy",
    label: "Pikachu mascot waving happily"
  },
  coffee: {
    pose: "coffee",
    accessory: "coffee",
    emotion: "happy",
    label: "Pikachu mascot holding a coffee cup"
  },
  happy: {
    pose: "idle",
    accessory: "none",
    emotion: "happy",
    label: "Pikachu mascot feeling happy"
  },
  sad: {
    pose: "idle",
    accessory: "none",
    emotion: "sad",
    label: "Pikachu mascot feeling sad"
  },
  sadCoffee: {
    pose: "coffee",
    accessory: "coffee",
    emotion: "sad",
    label: "Pikachu mascot holding coffee while sad"
  },
  celebrate: {
    pose: "celebrate",
    accessory: "sparkles",
    emotion: "happy",
    label: "Pikachu mascot celebrating"
  }
};

const KNOWN_POSES = new Set(["idle", "coffee", "celebrate", "wave"]);
const KNOWN_EMOTIONS = new Set(["happy", "sad", "neutral"]);
const KNOWN_ACCESSORIES = new Set(["none", "coffee", "sparkles"]);

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
  return String(value || "pikachu-mascot")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "pikachu-mascot";
}

function normalizePalette(name, accent) {
  const palette = pikachuPalettes[name] || pikachuPalettes.classic;
  const safeAccent = normalizeColor(accent);
  return {
    ...palette,
    accent: safeAccent || palette.accent,
    cupBand: safeAccent || palette.cupBand,
    cheek: safeAccent || palette.cheek
  };
}

function getArmPaths(pose, accessory) {
  if (accessory === "coffee" || pose === "coffee") {
    return {
      left: "M108 198 C88 202 74 218 68 238",
      right: "M212 198 C232 182 246 162 252 142",
      rightClass: "coffee-arm",
      leftClass: "support-arm"
    };
  }

  if (pose === "celebrate") {
    return {
      left: "M108 198 C84 170 72 142 78 112",
      right: "M212 198 C236 168 248 138 244 106",
      rightClass: "cheer-arm",
      leftClass: "cheer-arm"
    };
  }

  if (pose === "wave") {
    return {
      left: "M108 198 C86 204 72 220 66 242",
      right: "M212 198 C238 176 252 148 248 114",
      rightClass: "wave-arm",
      leftClass: "support-arm"
    };
  }

  return {
    left: "M108 198 C88 206 74 224 70 246",
    right: "M212 198 C234 206 248 224 252 246",
    rightClass: "support-arm",
    leftClass: "support-arm"
  };
}

function getHandMarkup(side, pose, accessory, palette) {
  const isCoffeeHand = (accessory === "coffee" || pose === "coffee") && side === "right";
  const isCelebrate = pose === "celebrate";
  const isWave = pose === "wave" && side === "right";

  if (isCoffeeHand) {
    return `
      <g class="pikachu-hand pikachu-hand-right coffee-hand" aria-hidden="true">
        <ellipse cx="254" cy="138" rx="14" ry="12" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="4" />
        <path d="M246 132 l-5-8 M250 130 l0-10 M254 130 l0-10 M258 132 l5-8 M262 136 l7-5" fill="none" stroke="${palette.ink}" stroke-width="3" stroke-linecap="round" />
      </g>
    `;
  }

  if (isCelebrate) {
    const cx = side === "left" ? 76 : 246;
    const cy = side === "left" ? 108 : 104;
    return `
      <g class="pikachu-hand pikachu-hand-${side}" aria-hidden="true">
        <ellipse cx="${cx}" cy="${cy}" rx="14" ry="12" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="4" />
        <path d="M${cx - 8} ${cy - 6} l-5-8 M${cx - 4} ${cy - 8} l0-10 M${cx} ${cy - 8} l0-10 M${cx + 4} ${cy - 8} l0-10 M${cx + 8} ${cy - 6} l5-8" fill="none" stroke="${palette.ink}" stroke-width="3" stroke-linecap="round" />
      </g>
    `;
  }

  if (isWave) {
    return `
      <g class="pikachu-hand pikachu-hand-right wave-hand" aria-hidden="true">
        <ellipse cx="250" cy="110" rx="14" ry="12" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="4" />
        <path d="M242 104 l-5-8 M246 102 l0-10 M250 102 l0-10 M254 104 l5-8 M258 108 l7-5" fill="none" stroke="${palette.ink}" stroke-width="3" stroke-linecap="round" />
      </g>
    `;
  }

  const cx = side === "left" ? 68 : 254;
  const cy = side === "left" ? 240 : 248;
  return `
    <g class="pikachu-hand pikachu-hand-${side}" aria-hidden="true">
      <ellipse cx="${cx}" cy="${cy}" rx="14" ry="12" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="4" />
      <path d="M${cx - 8} ${cy - 4} l-5-6 M${cx - 4} ${cy - 6} l0-8 M${cx} ${cy - 6} l0-8 M${cx + 4} ${cy - 6} l0-8 M${cx + 8} ${cy - 4} l5-6" fill="none" stroke="${palette.ink}" stroke-width="3" stroke-linecap="round" />
    </g>
  `;
}

function getAccessoryMarkup(accessory, palette) {
  if (accessory === "coffee") {
    return `
      <g class="coffee-cup" aria-hidden="true">
        <path class="steam steam-a" d="M228 88 C218 76 238 68 226 56" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round" opacity=".35" />
        <path class="steam steam-b" d="M248 86 C238 74 258 66 246 54" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round" opacity=".35" />
        <path class="steam steam-c" d="M268 90 C258 78 278 72 266 60" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round" opacity=".35" />
        <path d="M218 102 h58 l-7 52 c-1 7-7 12-14 12 h-20 c-7 0-13-5-14-12 l-7-52 z" fill="${palette.cup}" stroke="${palette.ink}" stroke-width="5" stroke-linejoin="round" />
        <path d="M218 116 h56 l-3 22 h-50 z" fill="${palette.cupBand}" opacity=".95" />
        <path d="M275 115 h11 c11 0 18 7 18 16 0 10-8 17-19 17 h-14" fill="none" stroke="${palette.ink}" stroke-width="6" stroke-linecap="round" />
        <path d="M236 124 h18" stroke="${palette.bodyHighlight}" stroke-width="4" stroke-linecap="round" opacity=".7" />
      </g>
    `;
  }

  if (accessory === "sparkles") {
    return `
      <g class="sparkle-field" aria-hidden="true">
        <path class="sparkle sparkle-a" d="M272 72 l7 16 16 7-16 7-7 16-7-16-16-7 16-7z" fill="${palette.accent}" />
        <path class="sparkle sparkle-b" d="M48 96 l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" fill="${palette.bodyHighlight}" />
        <path class="sparkle sparkle-extra-a" d="M286 148 l8 18 18 8-18 8-8 18-8-18-18-8 18-8z" fill="${palette.accent}" />
        <path class="sparkle sparkle-extra-b" d="M34 168 l6 13 13 6-13 6-6 13-6-13-13-6 13-6z" fill="${palette.bodyHighlight}" />
      </g>
    `;
  }

  return "";
}

function getFaceMarkup(emotion, palette) {
  if (emotion === "sad") {
    return `
      <g class="pikachu-face" aria-hidden="true">
        <ellipse class="pikachu-eye pikachu-eye-left" cx="132" cy="128" rx="11" ry="9" fill="${palette.ink}" />
        <ellipse class="pikachu-eye pikachu-eye-right" cx="188" cy="128" rx="11" ry="9" fill="${palette.ink}" />
        <path class="pikachu-eye-lid pikachu-eye-lid-left" d="M118 120 C126 114 138 114 146 120" fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" />
        <path class="pikachu-eye-lid pikachu-eye-lid-right" d="M174 120 C182 114 194 114 202 120" fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" />
        <circle class="pikachu-eye-highlight" cx="136" cy="124" r="3" fill="${palette.eyeHighlight}" opacity=".85" />
        <circle class="pikachu-eye-highlight" cx="192" cy="124" r="3" fill="${palette.eyeHighlight}" opacity=".85" />
        <path class="pikachu-mouth" d="M144 158 C152 148 168 148 176 158" fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" />
        <ellipse class="pikachu-tear pikachu-tear-left" cx="124" cy="142" rx="4" ry="7" fill="${palette.tear}" opacity=".85" />
        <ellipse class="pikachu-tear pikachu-tear-right" cx="196" cy="142" rx="4" ry="7" fill="${palette.tear}" opacity=".85" />
        <circle class="pikachu-nose" cx="160" cy="142" r="3" fill="${palette.ink}" />
        <circle class="pikachu-cheek pikachu-cheek-left" cx="108" cy="148" r="16" fill="${palette.cheek}" opacity=".92" />
        <circle class="pikachu-cheek pikachu-cheek-right" cx="212" cy="148" r="16" fill="${palette.cheek}" opacity=".92" />
      </g>
    `;
  }

  if (emotion === "neutral") {
    return `
      <g class="pikachu-face" aria-hidden="true">
        <circle class="pikachu-eye pikachu-eye-left" cx="132" cy="126" r="11" fill="${palette.ink}" />
        <circle class="pikachu-eye pikachu-eye-right" cx="188" cy="126" r="11" fill="${palette.ink}" />
        <circle class="pikachu-eye-highlight" cx="136" cy="121" r="3.5" fill="${palette.eyeHighlight}" />
        <circle class="pikachu-eye-highlight" cx="192" cy="121" r="3.5" fill="${palette.eyeHighlight}" />
        <path class="pikachu-mouth" d="M148 154 C156 160 164 160 172 154" fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" />
        <circle class="pikachu-nose" cx="160" cy="140" r="3" fill="${palette.ink}" />
        <circle class="pikachu-cheek pikachu-cheek-left" cx="108" cy="146" r="15" fill="${palette.cheek}" opacity=".88" />
        <circle class="pikachu-cheek pikachu-cheek-right" cx="212" cy="146" r="15" fill="${palette.cheek}" opacity=".88" />
      </g>
    `;
  }

  return `
    <g class="pikachu-face" aria-hidden="true">
      <circle class="pikachu-eye pikachu-eye-left" cx="132" cy="124" r="12" fill="${palette.ink}" />
      <circle class="pikachu-eye pikachu-eye-right" cx="188" cy="124" r="12" fill="${palette.ink}" />
      <circle class="pikachu-eye-highlight" cx="136" cy="118" r="4" fill="${palette.eyeHighlight}" />
      <circle class="pikachu-eye-highlight" cx="192" cy="118" r="4" fill="${palette.eyeHighlight}" />
      <path class="pikachu-mouth pikachu-mouth-open" d="M142 150 C148 168 172 168 178 150 Z" fill="${palette.mouthInterior}" stroke="${palette.ink}" stroke-width="4" stroke-linejoin="round" />
      <path class="pikachu-tongue" d="M152 158 C160 166 170 166 178 158 C170 164 160 164 152 158 Z" fill="${palette.tongue}" />
      <circle class="pikachu-nose" cx="160" cy="138" r="3" fill="${palette.ink}" />
      <circle class="pikachu-cheek pikachu-cheek-left" cx="106" cy="144" r="17" fill="${palette.cheek}" />
      <circle class="pikachu-cheek pikachu-cheek-right" cx="214" cy="144" r="17" fill="${palette.cheek}" />
    </g>
  `;
}

function getEarMarkup(emotion, palette) {
  const leftEarClass = emotion === "sad" ? "pikachu-ear pikachu-ear-left droopy-ear" : "pikachu-ear pikachu-ear-left";
  const rightEarClass = emotion === "sad" ? "pikachu-ear pikachu-ear-right droopy-ear" : "pikachu-ear pikachu-ear-right";

  return `
    <g class="${leftEarClass}" aria-hidden="true">
      <path d="M108 96 C88 42 72 24 54 12 C62 6 78 8 88 18 C98 30 106 68 114 94 Z" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="5" stroke-linejoin="round" />
      <path d="M62 18 C58 14 66 10 72 14 C78 18 82 24 78 30 C74 24 68 18 62 18 Z" fill="${palette.earTip}" stroke="${palette.ink}" stroke-width="3" stroke-linejoin="round" />
    </g>
    <g class="${rightEarClass}" aria-hidden="true">
      <path d="M212 96 C232 42 248 24 266 12 C258 6 242 8 232 18 C222 30 214 68 206 94 Z" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="5" stroke-linejoin="round" />
      <path d="M258 18 C262 14 254 10 248 14 C242 18 238 24 242 30 C246 24 252 18 258 18 Z" fill="${palette.earTip}" stroke="${palette.ink}" stroke-width="3" stroke-linejoin="round" />
    </g>
  `;
}

function getAnimationStyles() {
  return `
    .pikachu-svg * { transform-box: fill-box; }
    .pikachu-svg[data-animated="false"] * { animation: none !important; }

    .pikachu-float { transform-origin: center; }
    .pikachu-head { transform-origin: 160px 188px; }
    .pikachu-ear-left { transform-origin: 108px 96px; }
    .pikachu-ear-right { transform-origin: 212px 96px; }
    .pikachu-tail { transform-origin: 228px 228px; }
    .coffee-arm, .wave-arm, .cheer-arm, .support-arm, .coffee-cup, .sparkle, .steam, .pikachu-tear { transform-origin: center; }
    .pikachu-eye { transform-origin: center; }

    .pikachu-svg[data-animated="true"] .pikachu-float { animation: pikachu-bob 2.8s ease-in-out infinite; }
    .pikachu-svg[data-animated="true"] .shadow { animation: pikachu-shadow 2.8s ease-in-out infinite; transform-origin: center; }
    .pikachu-svg[data-animated="true"] .pikachu-eye { animation: pikachu-blink 5s infinite; }
    .pikachu-svg[data-animated="true"] .pikachu-tail { animation: pikachu-tail-wag 3.2s ease-in-out infinite; }

    .pikachu-svg[data-emotion="happy"][data-animated="true"] .pikachu-head { animation: pikachu-head-bounce 2.4s ease-in-out infinite; }
    .pikachu-svg[data-emotion="happy"][data-animated="true"] .pikachu-ear-left { animation: pikachu-ear-perk-left 2.6s ease-in-out infinite; }
    .pikachu-svg[data-emotion="happy"][data-animated="true"] .pikachu-ear-right { animation: pikachu-ear-perk-right 2.6s ease-in-out .15s infinite; }
    .pikachu-svg[data-emotion="happy"][data-animated="true"] .pikachu-cheek { animation: pikachu-cheek-glow 2.8s ease-in-out infinite; }

    .pikachu-svg[data-emotion="sad"][data-animated="true"] .pikachu-float { animation: pikachu-sad-bob 3.6s ease-in-out infinite; }
    .pikachu-svg[data-emotion="sad"][data-animated="true"] .pikachu-head { animation: pikachu-head-droop 3.2s ease-in-out infinite; }
    .pikachu-svg[data-emotion="sad"][data-animated="true"] .droopy-ear.pikachu-ear-left { animation: pikachu-ear-droop-left 3.2s ease-in-out infinite; }
    .pikachu-svg[data-emotion="sad"][data-animated="true"] .droopy-ear.pikachu-ear-right { animation: pikachu-ear-droop-right 3.2s ease-in-out .1s infinite; }
    .pikachu-svg[data-emotion="sad"][data-animated="true"] .pikachu-tear { animation: pikachu-tear-fall 2.4s ease-in infinite; }

    .pikachu-svg[data-pose="coffee"][data-animated="true"] .coffee-arm { animation: pikachu-hold 2.8s ease-in-out infinite; transform-origin: 212px 198px; }
    .pikachu-svg[data-pose="coffee"][data-animated="true"] .coffee-cup { animation: pikachu-cup-sway 2.8s ease-in-out infinite; transform-origin: 247px 130px; }
    .pikachu-svg[data-pose="coffee"][data-animated="true"] .steam-a { animation: pikachu-steam 2.2s ease-in-out infinite; }
    .pikachu-svg[data-pose="coffee"][data-animated="true"] .steam-b { animation: pikachu-steam 2.5s ease-in-out .25s infinite; }
    .pikachu-svg[data-pose="coffee"][data-animated="true"] .steam-c { animation: pikachu-steam 2.35s ease-in-out .5s infinite; }

    .pikachu-svg[data-pose="wave"][data-animated="true"] .wave-arm { animation: pikachu-wave 1.8s ease-in-out infinite; transform-origin: 212px 198px; }
    .pikachu-svg[data-pose="wave"][data-animated="true"] .wave-hand { animation: pikachu-wave-hand 1.8s ease-in-out infinite; transform-origin: 250px 110px; }

    .pikachu-svg[data-pose="celebrate"][data-animated="true"] .cheer-arm { animation: pikachu-cheer 1s ease-in-out infinite; }
    .pikachu-svg[data-animated="true"] .sparkle-a { animation: pikachu-twinkle 2.2s ease-in-out infinite; }
    .pikachu-svg[data-animated="true"] .sparkle-b { animation: pikachu-twinkle 2.4s ease-in-out .25s infinite; }
    .pikachu-svg[data-animated="true"] .sparkle-extra-a { animation: pikachu-twinkle 1.7s ease-in-out .1s infinite; }
    .pikachu-svg[data-animated="true"] .sparkle-extra-b { animation: pikachu-twinkle 1.9s ease-in-out .35s infinite; }

    @keyframes pikachu-bob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes pikachu-sad-bob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes pikachu-shadow {
      0%, 100% { transform: scaleX(1); opacity: .18; }
      50% { transform: scaleX(.86); opacity: .1; }
    }
    @keyframes pikachu-blink {
      0%, 88%, 94%, 100% { transform: scaleY(1); }
      90%, 92% { transform: scaleY(.08); }
    }
    @keyframes pikachu-tail-wag {
      0%, 100% { transform: rotate(-4deg); }
      50% { transform: rotate(6deg); }
    }
    @keyframes pikachu-head-bounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-3px) rotate(-1deg); }
    }
    @keyframes pikachu-head-droop {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(4px) rotate(2deg); }
    }
    @keyframes pikachu-ear-perk-left {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-4deg); }
    }
    @keyframes pikachu-ear-perk-right {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(4deg); }
    }
    @keyframes pikachu-ear-droop-left {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(14deg); }
    }
    @keyframes pikachu-ear-droop-right {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-14deg); }
    }
    @keyframes pikachu-cheek-glow {
      0%, 100% { opacity: .92; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.06); }
    }
    @keyframes pikachu-tear-fall {
      0% { transform: translateY(0) scaleY(1); opacity: .85; }
      70% { opacity: .5; }
      100% { transform: translateY(18px) scaleY(1.2); opacity: 0; }
    }
    @keyframes pikachu-hold {
      0%, 100% { transform: rotate(-2deg); }
      50% { transform: rotate(3deg); }
    }
    @keyframes pikachu-cup-sway {
      0%, 100% { transform: rotate(-1deg) translateY(0); }
      50% { transform: rotate(2deg) translateY(-2px); }
    }
    @keyframes pikachu-steam {
      0% { transform: translateY(8px) scale(.9); opacity: 0; }
      35% { opacity: .55; }
      100% { transform: translateY(-14px) scale(1.05); opacity: 0; }
    }
    @keyframes pikachu-wave {
      0%, 100% { transform: rotate(-6deg); }
      50% { transform: rotate(12deg); }
    }
    @keyframes pikachu-wave-hand {
      0%, 100% { transform: rotate(-8deg); }
      50% { transform: rotate(10deg); }
    }
    @keyframes pikachu-cheer {
      0%, 100% { transform: rotate(-8deg) translateY(0); }
      50% { transform: rotate(8deg) translateY(-8px); }
    }
    @keyframes pikachu-twinkle {
      0%, 100% { transform: scale(.72) rotate(0deg); opacity: .45; }
      50% { transform: scale(1.08) rotate(18deg); opacity: 1; }
    }
  `;
}

export function createPikachuSvg(options = {}) {
  const preset = pikachuPresets[options.preset] || {};
  const pose = normalizeChoice(options.pose || preset.pose, "idle", KNOWN_POSES);
  const emotion = normalizeChoice(options.emotion || preset.emotion, "happy", KNOWN_EMOTIONS);
  const defaultAccessory = pose === "coffee" ? "coffee" : preset.accessory || "none";
  const accessory = normalizeChoice(options.accessory || defaultAccessory, defaultAccessory, KNOWN_ACCESSORIES);
  const palette = normalizePalette(options.palette || "classic", options.accent);
  const label = escapeHtml(options.label || preset.label || "Pikachu mascot");
  const animated = boolAttr(options.animated ?? true);
  const includeStyles = options.includeStyles !== false;
  const idPrefix = normalizeId(options.idPrefix);
  const bodyGradientId = `${idPrefix}-body`;
  const headGradientId = `${idPrefix}-head`;
  const shadowFilterId = `${idPrefix}-soft-shadow`;
  const arms = getArmPaths(pose, accessory);

  return `
    <svg class="pikachu-svg" data-pose="${pose}" data-emotion="${emotion}" data-animated="${animated}" viewBox="0 0 320 320" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
      ${includeStyles ? `<style>${getAnimationStyles()}</style>` : ""}
      <defs>
        <linearGradient id="${bodyGradientId}" x1="96" y1="170" x2="224" y2="280" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette.bodyHighlight}" />
          <stop offset=".45" stop-color="${palette.body}" />
          <stop offset="1" stop-color="${palette.bodyShade}" />
        </linearGradient>
        <linearGradient id="${headGradientId}" x1="108" y1="72" x2="212" y2="188" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette.bodyHighlight}" />
          <stop offset=".55" stop-color="${palette.body}" />
          <stop offset="1" stop-color="${palette.bodyShade}" />
        </linearGradient>
        <linearGradient id="body-fill" x1="96" y1="72" x2="224" y2="280" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette.bodyHighlight}" />
          <stop offset=".5" stop-color="${palette.body}" />
          <stop offset="1" stop-color="${palette.bodyShade}" />
        </linearGradient>
        <filter id="${shadowFilterId}" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#1f2937" flood-opacity=".18" />
        </filter>
      </defs>

      <ellipse class="shadow" cx="160" cy="288" rx="78" ry="16" fill="#1f2937" opacity=".18" />
      ${getAccessoryMarkup(accessory === "sparkles" ? "sparkles" : "none", palette)}

      <g class="pikachu-float" filter="url(#${shadowFilterId})">
        <g class="pikachu-tail" aria-hidden="true">
          <path d="M228 228 L268 188 L248 228 L286 248 L228 268 L238 238 Z" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="5" stroke-linejoin="round" />
          <path d="M228 244 C236 238 244 236 252 240 C246 248 238 252 230 248 Z" fill="${palette.stripe}" stroke="${palette.ink}" stroke-width="3" stroke-linejoin="round" />
        </g>

        <g class="pikachu-body" aria-hidden="true">
          <path d="M102 188 C96 214 98 246 112 266 C128 278 152 282 160 282 C168 282 192 278 208 266 C222 246 224 214 218 188 C214 176 188 168 160 168 C132 168 106 176 102 188 Z" fill="url(#${bodyGradientId})" stroke="${palette.ink}" stroke-width="6" stroke-linejoin="round" />
          <path d="M118 206 C120 228 136 244 160 244 C184 244 200 228 202 206 C200 194 182 186 160 186 C138 186 120 194 118 206 Z" fill="${palette.bodyHighlight}" opacity=".28" />
          <path d="M148 198 h24" stroke="${palette.bodyShade}" stroke-width="4" stroke-linecap="round" opacity=".35" />
          <path d="M142 218 h36" stroke="${palette.stripe}" stroke-width="7" stroke-linecap="round" opacity=".75" />
          <path d="M138 236 h44" stroke="${palette.stripe}" stroke-width="7" stroke-linecap="round" opacity=".75" />

          <path class="${arms.leftClass}" d="${arms.left}" fill="none" stroke="${palette.ink}" stroke-width="16" stroke-linecap="round" />
          <path class="${arms.rightClass}" d="${arms.right}" fill="none" stroke="${palette.ink}" stroke-width="16" stroke-linecap="round" />
          ${getHandMarkup("left", pose, accessory, palette)}
          ${getHandMarkup("right", pose, accessory, palette)}
          ${accessory === "coffee" ? getAccessoryMarkup("coffee", palette) : ""}

          <g class="pikachu-feet" aria-hidden="true">
            <ellipse cx="132" cy="276" rx="18" ry="10" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="5" />
            <ellipse cx="188" cy="276" rx="18" ry="10" fill="url(#body-fill)" stroke="${palette.ink}" stroke-width="5" />
            <path d="M122 276 l-6 4 M128 278 l0 5 M134 278 l0 5 M140 276 l6 4" fill="none" stroke="${palette.ink}" stroke-width="3" stroke-linecap="round" />
            <path d="M178 276 l-6 4 M184 278 l0 5 M190 278 l0 5 M196 276 l6 4" fill="none" stroke="${palette.ink}" stroke-width="3" stroke-linecap="round" />
          </g>
        </g>

        <g class="pikachu-head" aria-hidden="true">
          ${getEarMarkup(emotion, palette)}
          <path d="M96 132 C96 78 124 58 160 58 C196 58 224 78 224 132 C224 176 196 196 160 196 C124 196 96 176 96 132 Z" fill="url(#${headGradientId})" stroke="${palette.ink}" stroke-width="6" stroke-linejoin="round" />
          <path d="M118 88 C132 72 188 72 202 88 C190 78 170 74 160 74 C150 74 130 78 118 88 Z" fill="${palette.bodyHighlight}" opacity=".42" />
          ${getFaceMarkup(emotion, palette)}
        </g>
      </g>
    </svg>
  `;
}
