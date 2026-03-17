import { useState } from 'react'
import StarRating from './StarRating'
import { exportRecipePdf } from '../utils/exportPdf'

export default function RecipeDetail({ recipe, onEdit, onDelete, onBack }) {
  const allPhotos = recipe.photos?.length > 0 ? recipe.photos : recipe.photo ? [recipe.photo] : []
  const [photoIndex, setPhotoIndex] = useState(0)

  function handleDelete() {
    if (window.confirm(`"${recipe.name}" wirklich löschen?`)) {
      onDelete(recipe.id)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="text-ci-500 hover:text-ci-700 mb-4 font-medium">
        ← Zurück
      </button>

      {allPhotos.length > 0 && (
        <div className="relative mb-6">
          <img src={allPhotos[photoIndex]} alt={recipe.name} className="w-full h-80 object-cover rounded-xl" />
          {allPhotos.length > 1 && (
            <>
              <button
                onClick={() => setPhotoIndex((photoIndex - 1 + allPhotos.length) % allPhotos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70"
              >
                ‹
              </button>
              <button
                onClick={() => setPhotoIndex((photoIndex + 1) % allPhotos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70"
              >
                ›
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allPhotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIndex(i)}
                    className={`w-2 h-2 rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-800">{recipe.name}</h2>
      <p className="text-gray-500 mt-1">{recipe.date}</p>
      <div className="mt-2">
        <StarRating rating={recipe.rating} readonly />
      </div>

      <p className="mt-6 text-gray-700 whitespace-pre-wrap leading-relaxed">{recipe.description}</p>

      <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
        <button
          onClick={() => onEdit(recipe)}
          className="bg-ci-500 text-white px-5 py-2 rounded-lg hover:bg-ci-600 transition-colors font-medium"
        >
          Bearbeiten
        </button>
        <button
          onClick={() => exportRecipePdf(recipe)}
          className="bg-ci-300 text-ci-900 px-5 py-2 rounded-lg hover:bg-ci-400 hover:text-white transition-colors font-medium"
        >
          PDF exportieren
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Löschen
        </button>
      </div>
    </div>
  )
}
