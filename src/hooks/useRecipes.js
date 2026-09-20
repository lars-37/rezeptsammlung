import { useState, useEffect, useCallback } from 'react'

const API_URL = 'https://ozeb3wntxp4yhbrsfv4a5ush.31.70.112.211.sslip.io'

function normalizeRecipe(recipe) {
  return {
    ...recipe,
    photos: recipe.photos || (recipe.photo ? [recipe.photo] : []),
    source: recipe.source || recipe.source_url || '',
    rating: recipe.rating || 0,
  }
}

export function useRecipes(user) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRecipes = useCallback(async () => {
    if (!user) {
      setRecipes([])
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/recipes`)

      if (!response.ok) {
        throw new Error(`API-Fehler ${response.status}`)
      }

      const data = await response.json()

      setRecipes(
        Array.isArray(data)
          ? data.map(normalizeRecipe)
          : []
      )
    } catch (error) {
      console.error('Fehler beim Laden der Rezepte:', error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  async function addRecipe(recipeData) {
    const response = await fetch(`${API_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: recipeData.name,
        date: recipeData.date,
        description: recipeData.description || '',
        photo: recipeData.photos?.[0] || '',
        source_url: recipeData.source || '',
      }),
    })

    if (!response.ok) {
      throw new Error(`API-Fehler ${response.status}`)
    }

    const data = normalizeRecipe(await response.json())

    setRecipes((prev) => [data, ...prev])

    return data
  }

  async function updateRecipe(id, recipeData) {
    const response = await fetch(`${API_URL}/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: recipeData.name,
        date: recipeData.date,
        description: recipeData.description || '',
        photo: recipeData.photos?.[0] || '',
        source_url: recipeData.source || '',
      }),
    })

    if (!response.ok) {
      throw new Error(`API-Fehler ${response.status}`)
    }

    const data = normalizeRecipe(await response.json())

    setRecipes((prev) =>
      prev.map((recipe) => (recipe.id === id ? data : recipe))
    )

    return data
  }

  async function deleteRecipe(id) {
    const response = await fetch(`${API_URL}/api/recipes/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`API-Fehler ${response.status}`)
    }

    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
  }

  return {
    recipes,
    loading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: fetchRecipes,
  }
}
cat src/hooks/useRecipes.js

