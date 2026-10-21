import { defineSparkMascot } from "./spark-mascot.js";
import { definePikachuMascot } from "./pikachu-mascot.js";

export { SparkMascotElement, defineSparkMascot } from "./spark-mascot.js";
export { createMascotSvg, mascotPalettes, mascotPresets } from "./mascot-svg.js";
export { PikachuMascotElement, definePikachuMascot } from "./pikachu-mascot.js";
export { createPikachuSvg, pikachuPalettes, pikachuPresets } from "./pikachu-svg.js";

if (typeof window !== "undefined" && window.customElements) {
  defineSparkMascot();
  definePikachuMascot();
}
