# CI-Skill: Lars Bösel – Corporate Identity Farben

## Zweck
Dieser Skill definiert die offiziellen Markenfarben von **Lars Bösel | Coach | Berater**. Verwende diese Farbwerte bei allen Design- und Entwicklungsaufgaben, um ein einheitliches Erscheinungsbild sicherzustellen.

## Farbpalette

### Primärfarbe – Blau (Hauptfarbe)
| Format | Wert |
|---|---|
| **RGB** | `140 / 160 / 184` |
| **HEX** | `#8CA0B8` |
| **CMYK** | `40 / 5 / 0 / 30` |
| **Pantone** | C 5415 C |
| **HKS** | 46 K 70% + 30K |

> Einsatz: Hintergründe, Headlines, primäre UI-Elemente, Logo-Hauptfarbe

### Akzentfarben

| Farbe | CMYK | HEX (Web) | Einsatz |
|---|---|---|---|
| **Rot** | `0 / 100 / 100 / 0` | `#FF0000` | Akzente, Warnungen, Logo-Segment |
| **Grün** | `100 / 0 / 100 / 0` | `#00A651` | Erfolg, Bestätigungen, Logo-Segment |
| **Lila** | `60 / 100 / 0 / 0` | `#6B2FA0` | Highlights, Logo-Segment |
| **Gelb** | `0 / 5 / 100 / 0` | `#FFF200` | Akzente, Aufmerksamkeit, Logo-Segment |
| **Hellblau** | `100 / 0 / 0 / 0` | `#00AEEF` | Links, interaktive Elemente, Logo-Segment |
| **Pink** | `0 / 100 / 0 / 0` | `#EC008C` | Highlights, Logo-Segment |

## CSS-Variablen (Copy & Paste)

```css
:root {
  /* Primär */
  --ci-blau: #8CA0B8;

  /* Akzentfarben */
  --ci-rot: #FF0000;
  --ci-gruen: #00A651;
  --ci-lila: #6B2FA0;
  --ci-gelb: #FFF200;
  --ci-hellblau: #00AEEF;
  --ci-pink: #EC008C;

  /* Neutrals (abgeleitet) */
  --ci-blau-hell: #B8C8D8;
  --ci-blau-dunkel: #5A7090;
  --ci-weiss: #FFFFFF;
  --ci-schwarz: #1A1A1A;
}
```

## Tailwind-Konfiguration

```js
// In tailwind.config.js oder als Inline-Theme
colors: {
  ci: {
    blau:     '#8CA0B8',
    rot:      '#FF0000',
    gruen:    '#00A651',
    lila:     '#6B2FA0',
    gelb:     '#FFF200',
    hellblau: '#00AEEF',
    pink:     '#EC008C',
  }
}
```

## Anwendungsregeln

1. **Web & Screen:** Immer RGB/HEX-Werte verwenden (JPG, PNG)
2. **Druck:** CMYK-Werte nutzen (AI, EPS, PDF)
3. **Primärfarbe Blau** ist die dominante Farbe – Akzentfarben sparsam einsetzen
4. **Logo:** Die bunten Akzentfarben erscheinen im Buchstaben "Ö" des Logos
5. **Kontrast:** Auf weißem Hintergrund die Primärfarbe Blau verwenden, auf dunklem Hintergrund die Logo-Negativ-Variante (weiß)
