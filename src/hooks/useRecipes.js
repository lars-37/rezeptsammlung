import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useRecipes(user) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRecipes = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setRecipes(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  async function addRecipe(recipeData) {
    const photos = await uploadPhotos(recipeData.photos || [])
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        name: recipeData.name,
        description: recipeData.description,
        date: recipeData.date,
        rating: recipeData.rating,
        photos,
        source: recipeData.source || null,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    setRecipes((prev) => [data, ...prev])
    return data
  }

  async function updateRecipe(id, recipeData) {
    const photos = await uploadPhotos(recipeData.photos || [])
    const { data, error } = await supabase
      .from('recipes')
      .update({
        name: recipeData.name,
        description: recipeData.description,
        date: recipeData.date,
        rating: recipeData.rating,
        photos,
        source: recipeData.source || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setRecipes((prev) => prev.map((r) => (r.id === id ? data : r)))
    return data
  }

  async function deleteRecipe(id) {
    const recipe = recipes.find((r) => r.id === id)
    // Fotos aus Storage löschen
    if (recipe?.photos?.length) {
      const paths = recipe.photos
        .filter((url) => url.includes('supabase'))
        .map((url) => {
          const match = url.match(/recipe-photos\/(.+)$/)
          return match ? match[1] : null
        })
        .filter(Boolean)
      if (paths.length) await supabase.storage.from('recipe-photos').remove(paths)
    }

    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) throw error
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  return { recipes, loading, addRecipe, updateRecipe, deleteRecipe, refetch: fetchRecipes }
}

// Fotos hochladen: Base64 → Supabase Storage, URLs bleiben URLs
async function uploadPhotos(photos) {
  const uploaded = []
  for (const photo of photos) {
    if (photo.startsWith('data:')) {
      // Base64 → in Storage hochladen
      const blob = await fetch(photo).then((r) => r.blob())
      const ext = blob.type.includes('png') ? 'png' : 'jpg'
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('recipe-photos').upload(path, blob, {
        contentType: blob.type,
      })
      if (!error) {
        const { data } = supabase.storage.from('recipe-photos').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    } else {
      // Bereits eine URL (z.B. von Import) — behalten
      uploaded.push(photo)
    }
  }
  return uploaded
}
