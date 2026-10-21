import { createMascotSvg, mascotPresets } from "./mascot-svg.js";

const SIZE_TOKENS = {
  xs: "72px",
  sm: "104px",
  md: "152px",
  lg: "220px",
  xl: "320px"
};

let elementId = 0;

function isTruthyAttribute(value) {
  return value !== null && value !== "false" && value !== "0";
}

function safeSize(value) {
  if (!value) return SIZE_TOKENS.md;
  if (SIZE_TOKENS[value]) return SIZE_TOKENS[value];
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) return value;
  return SIZE_TOKENS.md;
}

export class SparkMascotElement extends HTMLElement {
  static get observedAttributes() {
    return ["pose", "preset", "accessory", "palette", "accent", "animated", "label", "size", "interactive"];
  }

  constructor() {
    super();
    elementId += 1;
    this.mascotId = `spark-mascot-${elementId}`;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const presetName = this.getAttribute("preset");
    const preset = mascotPresets[presetName] || {};
    const size = safeSize(this.getAttribute("size"));
    const animated = !this.hasAttribute("animated") || isTruthyAttribute(this.getAttribute("animated"));
    const interactive = isTruthyAttribute(this.getAttribute("interactive"));

    this.style.setProperty("--spark-mascot-size", size);

    const svg = createMascotSvg({
      preset: presetName,
      pose: this.getAttribute("pose") || preset.pose,
      accessory: this.getAttribute("accessory") || preset.accessory,
      palette: this.getAttribute("palette") || "citrus",
      accent: this.getAttribute("accent"),
      label: this.getAttribute("label") || preset.label,
      animated,
      idPrefix: this.mascotId
    });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          inline-size: var(--spark-mascot-size, ${SIZE_TOKENS.md});
          max-inline-size: 100%;
          vertical-align: middle;
        }

        .mascot-shell {
          display: grid;
          inline-size: 100%;
          aspect-ratio: 1;
          place-items: center;
          transition: transform 180ms ease, filter 180ms ease;
        }

        .mascot-shell[data-interactive="true"]:hover {
          transform: translateY(-3px) scale(1.02);
          filter: saturate(1.04);
        }

        svg {
          display: block;
          inline-size: 100%;
          block-size: auto;
        }

        @media (prefers-reduced-motion: reduce) {
          .mascot-shell {
            transition: none;
          }
        }
      </style>
      <span class="mascot-shell" part="shell" data-interactive="${interactive}">
        ${svg}
      </span>
    `;
  }
}

export function defineSparkMascot(tagName = "spark-mascot") {
  if (typeof window === "undefined" || !window.customElements) return;
  if (!window.customElements.get(tagName)) {
    window.customElements.define(tagName, SparkMascotElement);
  }
}
