import { useState } from 'react'
import { importFromUrl } from '../utils/importRecipe'
import StarRating from './StarRating'

export default function ImportDialog({ onImport, onClose }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  async function handleFetch() {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setPreview(null)
    try {
      const data = await importFromUrl(url.trim())
      setPreview(data)
    } catch (err) {
      setError(err.message || 'Import fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleFetch()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-ci-700">🔗 Rezept von URL importieren</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://www.chefkoch.de/rezepte/..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ci-300"
              autoFocus
            />
            <button
              onClick={handleFetch}
              disabled={loading || !url.trim()}
              className="bg-ci-hellblau text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
            >
              {loading ? '...' : 'Laden'}
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-ci-200 border-t-ci-500 rounded-full animate-spin" />
              <span className="ml-3 text-gray-500">Rezept wird geladen...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-ci-rot rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {preview && (
            <div className="border border-ci-200 rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-lg text-ci-800">{preview.name}</h3>

              {preview.photos?.[0] && (
                <img
                  src={preview.photos[0]}
                  alt={preview.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              {preview.rating > 0 && (
                <StarRating rating={preview.rating} readonly />
              )}

              <p className="text-sm text-gray-600 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {preview.description}
              </p>

              {preview.source && (
                <p className="text-xs text-gray-400 truncate">
                  Quelle: {preview.source}
                </p>
              )}

              <div className="flex gap-3 pt-2 border-t">
                <button
                  onClick={() => onImport(preview)}
                  className="bg-ci-500 text-white px-5 py-2 rounded-lg hover:bg-ci-600 transition-colors font-medium"
                >
                  Rezept übernehmen
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Verwerfen
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            Funktioniert mit Chefkoch, Lecker, EatSmarter, BBC Good Food und vielen weiteren Rezeptseiten.
          </p>
        </div>
      </div>
    </div>
  )
}
