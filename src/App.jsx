import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import RecipeList from './components/RecipeList'
import RecipeForm from './components/RecipeForm'
import RecipeDetail from './components/RecipeDetail'
import ImportDialog from './components/ImportDialog'

export default function App() {
  const [recipes, setRecipes] = useLocalStorage('recipes', [])
  const [view, setView] = useState('list')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showImport, setShowImport] = useState(false)

  function addRecipe(data) {
    const recipe = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setRecipes([recipe, ...recipes])
    setView('list')
  }

  function handleImported(data) {
    addRecipe(data)
    setShowImport(false)
  }

  function updateRecipe(data) {
    setRecipes(recipes.map((r) => (r.id === selectedRecipe.id ? { ...selectedRecipe, ...data } : r)))
    setView('list')
    setSelectedRecipe(null)
  }

  function deleteRecipe(id) {
    setRecipes(recipes.filter((r) => r.id !== id))
    setView('list')
    setSelectedRecipe(null)
  }

  function openDetail(id) {
    setSelectedRecipe(recipes.find((r) => r.id === id))
    setView('detail')
  }

  function openEdit(recipe) {
    setSelectedRecipe(recipe)
    setView('edit')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-ci-600 cursor-pointer"
            onClick={() => { setView('list'); setSelectedRecipe(null) }}
          >
            Rezeptsammlung
          </h1>
          {view === 'list' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowImport(true)}
                className="bg-ci-hellblau text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                🔗 URL Import
              </button>
              <button
                onClick={() => setView('add')}
                className="bg-ci-500 text-white px-4 py-2 rounded-lg hover:bg-ci-600 transition-colors font-medium"
              >
                + Neues Rezept
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === 'list' && <RecipeList recipes={recipes} onSelect={openDetail} />}
        {view === 'add' && <RecipeForm onSave={addRecipe} onCancel={() => setView('list')} />}
        {view === 'edit' && (
          <RecipeForm recipe={selectedRecipe} onSave={updateRecipe} onCancel={() => setView('list')} />
        )}
        {view === 'detail' && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onEdit={openEdit}
            onDelete={deleteRecipe}
            onBack={() => { setView('list'); setSelectedRecipe(null) }}
          />
        )}
      </main>

      {showImport && (
        <ImportDialog onImport={handleImported} onClose={() => setShowImport(false)} />
      )}
    </div>
  )
}
