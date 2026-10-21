# Spark Mascot Design System

Spark is an original electric mascot built for UI surfaces. It can nod to high-energy creature mascots without copying Pokemon character traits, silhouettes, names, marks, or signature details.

## Character Rules

- Keep the body bean-shaped, with leaf-like fins and an antenna spark.
- Avoid red cheek circles, zig-zag tails, black-tipped long ears, or other recognizable Pokemon identifiers.
- Use the lightning mark as a generic energy motif, not as a character-specific costume.
- Give each domain a prop: coffee cup, headset, shopping bag, delivery badge, celebration sparkles.

## Component API

```html
<spark-mascot
  pose="coffee"
  accessory="coffee"
  palette="citrus"
  accent="#13b8a6"
  animated
  interactive
  size="xl"
></spark-mascot>
```

## Poses

- `idle`: default storefront or empty-state buddy.
- `coffee`: mascot holding an animated coffee cup.
- `support`: mascot with a headset.
- `celebrate`: mascot with extra sparkles for success states.

## Adding A New Domain

1. Add an accessory name to `KNOWN_ACCESSORIES`.
2. Add the accessory SVG group inside `getAccessoryMarkup`.
3. Add a preset to `mascotPresets`.
4. Add animation classes to `getAnimationStyles` only if the prop needs motion.

This keeps the mascot as one reusable character system instead of many one-off illustrations.
