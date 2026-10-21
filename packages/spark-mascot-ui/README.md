# Spark Mascot UI

A small reusable animated SVG mascot framework. It ships as a Web Component, so it works in React, Vue, Svelte, plain HTML, and micro-frontends without a framework adapter.

The mascot is intentionally original. It is a cute electric buddy with its own silhouette, antenna spark, palette system, and domain props.

## Quick Start

```html
<script type="module" src="./src/index.js"></script>

<spark-mascot
  pose="coffee"
  accessory="coffee"
  palette="citrus"
  animated
  interactive
  size="xl"
></spark-mascot>
```

## React Usage

Import once near your app shell:

```tsx
import "@grab/spark-mascot-ui";
```

Then render the custom element:

```tsx
export function CoffeeHeroMascot() {
  return (
    <spark-mascot
      pose="coffee"
      accessory="coffee"
      palette="citrus"
      animated
      interactive
      size="xl"
    />
  );
}
```

For TypeScript React projects, add this once in a local `custom-elements.d.ts` file:

```ts
import type React from "react";

declare namespace JSX {
  interface IntrinsicElements {
    "spark-mascot": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      pose?: "idle" | "coffee" | "celebrate" | "support";
      preset?: "idle" | "coffee" | "celebrate" | "support";
      accessory?: "none" | "coffee" | "sparkles" | "headset";
      palette?: "citrus" | "berry" | "mint";
      accent?: string;
      animated?: boolean | string;
      interactive?: boolean | string;
      size?: "xs" | "sm" | "md" | "lg" | "xl" | string;
    };
  }
}
```

## API

| Attribute | Values | Purpose |
| --- | --- | --- |
| `pose` | `idle`, `coffee`, `celebrate`, `support` | Sets body/arm pose. |
| `accessory` | `none`, `coffee`, `sparkles`, `headset` | Adds domain-specific props. |
| `palette` | `citrus`, `berry`, `mint` | Sets character theme. |
| `accent` | CSS color | Overrides the accent color. |
| `animated` | boolean attribute or `false` | Enables or disables SVG animation. |
| `interactive` | boolean attribute | Adds a hover lift. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, CSS size | Controls rendered size. |

## Demo

From this repo:

```bash
npm run demo
```

Open [http://127.0.0.1:4177/examples/](http://127.0.0.1:4177/examples/).

## Validate

```bash
npm run check
```
