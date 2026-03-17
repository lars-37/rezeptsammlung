import { useState } from 'react'
import RecipeCard from './RecipeCard'
import StarRating from './StarRating'

function RecipeRow({ recipe, onClick }) {
  const thumb = recipe.photos?.[0] || recipe.photo
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm flex items-center gap-4 p-3 cursor-pointer hover:shadow-md transition-all border-l-4 border-ci-300 hover:border-ci-500"
    >
      {thumb ? (
        <img src={thumb} alt={recipe.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-2xl shrink-0">
          🍽
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{recipe.name}</h3>
        <p className="text-sm text-gray-500">{recipe.date}</p>
      </div>
      <div className="shrink-0">
        <StarRating rating={recipe.rating} readonly />
      </div>
    </div>
  )
}

export default function RecipeList({ recipes, onSelect }) {
  const [viewMode, setViewMode] = useState('grid')

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-5xl mb-4">📖</p>
        <p className="text-lg">Noch keine Rezepte vorhanden.</p>
        <p className="text-sm mt-1">Füge dein erstes Rezept hinzu!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4 gap-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-ci-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
        >
          ▦ Grid
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-ci-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
        >
          ☰ Liste
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onSelect(recipe.id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {recipes.map((recipe) => (
            <RecipeRow key={recipe.id} recipe={recipe} onClick={() => onSelect(recipe.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
