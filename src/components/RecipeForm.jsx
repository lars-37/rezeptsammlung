import { useState } from 'react'
import StarRating from './StarRating'

function compressImage(file, maxDim = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim
            width = maxDim
          } else {
            width = (width / height) * maxDim
            height = maxDim
          }
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function RecipeForm({ recipe, onSave, onCancel, saving }) {
  const [name, setName] = useState(recipe?.name || '')
  const [description, setDescription] = useState(recipe?.description || '')
  const [photos, setPhotos] = useState(recipe?.photos || [])
  const [date, setDate] = useState(recipe?.date || new Date().toISOString().split('T')[0])
  const [rating, setRating] = useState(recipe?.rating || 0)

  async function handlePhotos(e) {
    const files = Array.from(e.target.files || [])

    for (const file of files) {
      const compressed = await compressImage(file)
      const blob = await fetch(compressed).then((r) => r.blob())

      const formData = new FormData()
      formData.append('file', blob, 'photo.jpg')

      const response = await fetch(
        'https://ozeb3wntxp4yhbrsfv4a5ush.31.70.112.211.sslip.io/api/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error(`Foto-Upload fehlgeschlagen: ${response.status}`)
      }

      const data = await response.json()
      setPhotos((prev) => [...prev, data.url])
    }

    e.target.value = ''
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), description, photos, date, rating })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ci-300"
          placeholder="Rezeptname"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fotos</label>
        <input type="file" accept="image/*" multiple onChange={handlePhotos} className="text-sm" />
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {photos.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt={`Foto ${i + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ci-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ci-300"
          placeholder="Zutaten, Zubereitung, Notizen..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bewertung</label>
        <StarRating rating={rating} onChange={setRating} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-ci-500 text-white px-6 py-2 rounded-lg hover:bg-ci-600 transition-colors font-medium disabled:opacity-50"
        >
          {saving ? 'Wird gespeichert...' : recipe ? 'Speichern' : 'Hinzufügen'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  )
}
