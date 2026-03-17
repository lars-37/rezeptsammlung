import StarRating from './StarRating'

export default function RecipeCard({ recipe, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all border-l-4 border-ci-300 hover:border-ci-500"
    >
      {recipe.photos?.length > 0 ? (
        <img src={recipe.photos[0]} alt={recipe.name} className="w-full h-48 object-cover" />
      ) : recipe.photo ? (
        <img src={recipe.photo} alt={recipe.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
          🍽
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">{recipe.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{recipe.date}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{recipe.description}</p>
        <div className="mt-2">
          <StarRating rating={recipe.rating} readonly />
        </div>
      </div>
    </div>
  )
}
