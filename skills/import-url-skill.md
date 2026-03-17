# Skill: Rezept-Import von URL

## Zweck
Importiere Rezepte automatisch von beliebigen Rezept-Websites (Chefkoch, Lecker, EatSmarter, Küchengötter, BBC Good Food etc.). Extrahiere Name, Beschreibung, Zutaten, Zubereitung, Foto und Bewertung — der Nutzer muss nichts manuell abtippen.

## Wann verwenden?
- Nutzer will ein Rezept von einer Website importieren
- Nutzer nennt eine URL zu einem Rezept
- Nutzer sagt "Rezept von Chefkoch holen" o.ä.
- Nutzer will mehrere Rezepte auf einmal importieren

## Technischer Hintergrund

### Warum funktioniert das?
Die meisten Rezept-Websites betten **strukturierte Daten** im JSON-LD-Format (schema.org/Recipe) in ihre Seiten ein. Das ist ein maschinenlesbarer Block im HTML, der alle Rezeptinfos enthält — Name, Zutaten, Schritte, Bild, Bewertung. Google nutzt das für die Suche, und wir nutzen es für den Import.

### CORS-Problem
Browser blockieren direkte Requests an fremde Domains (CORS). Lösung: Ein kleiner Proxy-Endpoint oder ein kostenloser CORS-Proxy-Service.

## Implementierung

### 1. URL-Parser Utility (`src/utils/importRecipe.js`)

```javascript
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

export async function importFromUrl(url) {
  // HTML der Rezeptseite laden (über CORS-Proxy)
  const response = await fetch(CORS_PROXY + encodeURIComponent(url))
  if (!response.ok) throw new Error('Seite konnte nicht geladen werden')
  const html = await response.text()

  // JSON-LD Rezeptdaten aus dem HTML extrahieren
  const recipe = extractJsonLd(html)
  if (recipe) return normalizeRecipe(recipe, url)

  // Fallback: Meta-Tags auswerten
  return extractFromMeta(html, url)
}

function extractJsonLd(html) {
  // Alle <script type="application/ld+json"> Blöcke finden
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1])
      // Kann ein einzelnes Objekt oder ein Array sein
      const items = Array.isArray(data) ? data
        : data['@graph'] ? data['@graph']
        : [data]
      const recipe = items.find(item =>
        item['@type'] === 'Recipe' ||
        (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))
      )
      if (recipe) return recipe
    } catch { /* JSON parse fehlgeschlagen, nächsten Block versuchen */ }
  }
  return null
}

function extractFromMeta(html, url) {
  // Fallback über Open Graph / Meta-Tags
  const get = (prop) => {
    const m = html.match(new RegExp(`<meta[^>]*(?:property|name)="${prop}"[^>]*content="([^"]*)"`, 'i'))
    return m ? m[1] : ''
  }
  return {
    name: get('og:title') || get('title') || 'Importiertes Rezept',
    description: get('og:description') || get('description') || '',
    photos: get('og:image') ? [get('og:image')] : [],
    date: new Date().toISOString().split('T')[0],
    rating: 0,
    source: url
  }
}

function normalizeRecipe(data, url) {
  // Zutaten: kann String-Array oder Objekt-Array sein
  const ingredients = (data.recipeIngredient || [])
    .map(i => typeof i === 'string' ? i : i.name || '')
    .filter(Boolean)

  // Zubereitung: kann String-Array oder HowToStep-Array sein
  const steps = (data.recipeInstructions || [])
    .map(s => typeof s === 'string' ? s : s.text || '')
    .filter(Boolean)

  // Beschreibung zusammenbauen
  const description = [
    data.description || '',
    '',
    ingredients.length ? '🥘 Zutaten:' : '',
    ...ingredients.map(i => `• ${i}`),
    '',
    steps.length ? '👨‍🍳 Zubereitung:' : '',
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    data.totalTime ? `⏱ Zeit: ${formatDuration(data.totalTime)}` : '',
    data.recipeYield ? `🍽 Portionen: ${data.recipeYield}` : '',
  ].filter(line => line !== undefined).join('\n').trim()

  // Bild: kann String oder Array sein
  let photos = []
  if (data.image) {
    if (typeof data.image === 'string') photos = [data.image]
    else if (Array.isArray(data.image)) photos = data.image.map(i => typeof i === 'string' ? i : i.url || '')
    else if (data.image.url) photos = [data.image.url]
  }

  // Bewertung
  const rating = data.aggregateRating
    ? Math.round(parseFloat(data.aggregateRating.ratingValue) || 0)
    : 0

  return {
    name: data.name || 'Importiertes Rezept',
    description,
    photos,
    date: new Date().toISOString().split('T')[0],
    rating: Math.min(rating, 5),
    source: url
  }
}

function formatDuration(iso) {
  // PT1H30M → "1 Std. 30 Min."
  const h = iso.match(/(\d+)H/)
  const m = iso.match(/(\d+)M/)
  const parts = []
  if (h) parts.push(`${h[1]} Std.`)
  if (m) parts.push(`${m[1]} Min.`)
  return parts.join(' ') || iso
}
```

### 2. Import-Dialog in der UI

Einen "Von URL importieren"-Button in der Header-Leiste oder als Alternative im RecipeForm einbauen. Minimaler Flow:

1. Nutzer klickt "URL importieren"
2. Modal/Prompt öffnet sich → URL eingeben
3. Loading-Spinner während Import läuft
4. Rezeptvorschau anzeigen → Nutzer kann vor dem Speichern bearbeiten
5. Speichern → normaler addRecipe-Flow

### 3. CI-Konformität
- Import-Button: `bg-ci-hellblau text-white` (hebt sich als Spezial-Aktion ab)
- Loading-Spinner: `border-ci-300`
- Fehlermeldungen: `text-ci-rot`

## Getestete Websites

| Website | JSON-LD | Fallback | Status |
|---|---|---|---|
| chefkoch.de | ✅ | ✅ | Funktioniert |
| lecker.de | ✅ | ✅ | Funktioniert |
| eatsmarter.de | ✅ | ✅ | Funktioniert |
| kuechengötter.de | ✅ | ✅ | Funktioniert |
| bbcgoodfood.com | ✅ | ✅ | Funktioniert |
| allrecipes.com | ✅ | ✅ | Funktioniert |

## Einschränkungen
- **Fotos als URL**: Importierte Fotos sind externe URLs, keine Base64-Daten. Sie werden nicht im localStorage gespeichert, sondern direkt von der Quellseite geladen. Bei Bedarf können sie in Base64 konvertiert werden (erhöht aber den localStorage-Verbrauch).
- **CORS-Proxy**: Der kostenlose `allorigins.win`-Proxy hat Rate-Limits. Für Produktiv-Einsatz einen eigenen Proxy oder eine Serverless Function (z.B. Cloudflare Worker) verwenden.
- **Nicht alle Seiten**: Manche Seiten nutzen kein JSON-LD — der Meta-Tag-Fallback liefert dann nur Name + Beschreibung, keine Zutaten.
