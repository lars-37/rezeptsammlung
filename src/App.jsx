import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useRecipes } from './hooks/useRecipes'
import RecipeList from './components/RecipeList'
import RecipeForm from './components/RecipeForm'
import RecipeDetail from './components/RecipeDetail'
import ImportDialog from './components/ImportDialog'
import Auth from './components/Auth'

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const { recipes, loading: recipesLoading, addRecipe, updateRecipe, deleteRecipe } = useRecipes(user)
  const [view, setView] = useState('list')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [saving, setSaving] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth signIn={signIn} signUp={signUp} />
  }

  async function handleAdd(data) {
    setSaving(true)
    try {
      await addRecipe(data)
      setView('list')
    } catch (err) {
      alert('Fehler beim Speichern: ' + err.message)
    }
    setSaving(false)
  }

  async function handleImported(data) {
    setSaving(true)
    try {
      await addRecipe(data)
      setShowImport(false)
    } catch (err) {
      alert('Fehler beim Import: ' + err.message)
    }
    setSaving(false)
  }

  async function handleUpdate(data) {
    setSaving(true)
    try {
      await updateRecipe(selectedRecipe.id, data)
      setView('list')
      setSelectedRecipe(null)
    } catch (err) {
      alert('Fehler beim Aktualisieren: ' + err.message)
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    try {
      await deleteRecipe(id)
      setView('list')
      setSelectedRecipe(null)
    } catch (err) {
      alert('Fehler beim Löschen: ' + err.message)
    }
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
          <div className="flex items-center gap-3">
            {view === 'list' && (
              <>
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
              </>
            )}
            <button
              onClick={signOut}
              className="text-gray-400 hover:text-gray-600 text-sm ml-2"
              title="Abmelden"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {recipesLoading ? (
          <p className="text-center text-gray-500">Rezepte werden geladen...</p>
        ) : (
          <>
            {view === 'list' && <RecipeList recipes={recipes} onSelect={openDetail} />}
            {view === 'add' && (
              <RecipeForm onSave={handleAdd} onCancel={() => setView('list')} saving={saving} />
            )}
            {view === 'edit' && (
              <RecipeForm
                recipe={selectedRecipe}
                onSave={handleUpdate}
                onCancel={() => setView('list')}
                saving={saving}
              />
            )}
            {view === 'detail' && selectedRecipe && (
              <RecipeDetail
                recipe={selectedRecipe}
                onEdit={openEdit}
                onDelete={handleDelete}
                onBack={() => { setView('list'); setSelectedRecipe(null) }}
              />
            )}
          </>
        )}
      </main>

      {showImport && (
        <ImportDialog onImport={handleImported} onClose={() => setShowImport(false)} />
      )}
    </div>
  )
}
