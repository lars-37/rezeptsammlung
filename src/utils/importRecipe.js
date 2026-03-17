// Mehrere CORS-Proxies als Fallback — wenn einer nicht geht, wird der nächste versucht
const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
]

async function fetchWithFallback(url) {
  const errors = []
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy(url)
      const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const html = await response.text()
      if (html && html.length > 200) return html
      throw new Error('Leere Antwort')
    } catch (err) {
      errors.push(err.message)
    }
  }
  throw new Error(`Seite konnte nicht geladen werden. Versuche es mit einer anderen URL.\n(${errors.join(', ')})`)
}

export async function importFromUrl(url) {
  const html = await fetchWithFallback(url)

  const recipe = extractJsonLd(html)
  if (recipe) return normalizeRecipe(recipe, url)

  return extractFromMeta(html, url)
}

function extractJsonLd(html) {
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1])
      const items = Array.isArray(data) ? data
        : data['@graph'] ? data['@graph']
        : [data]
      const recipe = items.find(item =>
        item['@type'] === 'Recipe' ||
        (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))
      )
      if (recipe) return recipe
    } catch { /* nächsten Block versuchen */ }
  }
  return null
}

function extractFromMeta(html, url) {
  const get = (prop) => {
    const m = html.match(new RegExp(`<meta[^>]*(?:property|name)="${prop}"[^>]*content="([^"]*)"`, 'i'))
    return m ? m[1] : ''
  }
  return {
    name: get('og:title') || 'Importiertes Rezept',
    description: get('og:description') || '',
    photos: get('og:image') ? [get('og:image')] : [],
    date: new Date().toISOString().split('T')[0],
    rating: 0,
    source: url
  }
}

function normalizeRecipe(data, url) {
  const ingredients = (data.recipeIngredient || [])
    .map(i => typeof i === 'string' ? i : i.name || '')
    .filter(Boolean)

  const steps = (data.recipeInstructions || [])
    .map(s => typeof s === 'string' ? s : s.text || '')
    .filter(Boolean)

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

  let photos = []
  if (data.image) {
    if (typeof data.image === 'string') photos = [data.image]
    else if (Array.isArray(data.image)) photos = data.image.map(i => typeof i === 'string' ? i : i.url || '')
    else if (data.image.url) photos = [data.image.url]
  }

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
  const h = iso.match(/(\d+)H/)
  const m = iso.match(/(\d+)M/)
  const parts = []
  if (h) parts.push(`${h[1]} Std.`)
  if (m) parts.push(`${m[1]} Min.`)
  return parts.join(' ') || iso
}
