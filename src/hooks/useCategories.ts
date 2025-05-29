import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, addDoc, Timestamp, QueryDocumentSnapshot, type DocumentData, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export interface Category {
  id: string
  name: string
  locationId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryData {
  name: string
}

const categoriesCache: Record<string, Category[]> = {}
let allCategoriesCache: Category[] | null = null

export const useCategories = (locationId?: string) => {
  const [categories, setCategories] = useState<Category[]>(
    locationId
      ? (categoriesCache[locationId] || [])
      : (allCategoriesCache || [])
  )
  const [loading, setLoading] = useState(
    locationId
      ? !categoriesCache[locationId]
      : !allCategoriesCache
  )
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (locationId && categoriesCache[locationId]) {
      setCategories(categoriesCache[locationId])
      setLoading(false)
      return
    }
    if (!locationId && allCategoriesCache) {
      setCategories(allCategoriesCache)
      setLoading(false)
      return
    }

    const q = locationId
      ? query(collection(db, 'categories'), where('locationId', '==', locationId))
      : query(collection(db, 'categories'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          name: doc.data().name,
          locationId: doc.data().locationId,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }))
        setCategories(list)

        if (locationId) {
          categoriesCache[locationId] = list
        } else {
          allCategoriesCache = list
        }
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching categories:', error)
        setError(error as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [locationId])

  const createCategory = async (data: CreateCategoryData) => {
    if (!locationId) throw new Error('Location ID is required')
    if (!data.name.trim()) throw new Error('Category name is required')

    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        name: data.name.trim(),
        locationId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding category:', err)
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id))
    } catch (err) {
      console.error('Error deleting category:', err)
      throw err instanceof Error ? err : new Error('Failed to delete category')
    }
  }

  const updateCategory = async (id: string, newName: string) => {
    try {
      await updateDoc(doc(db, 'categories', id), {
        name: newName.trim(),
        updatedAt: Timestamp.now()
      })
    } catch (err) {
      console.error('Error updating category:', err)
      throw err instanceof Error ? err : new Error('Failed to update category')
    }
  }

  return {
    categories,
    loading,
    error,
    isEmpty: categories.length === 0,
    createCategory,
    deleteCategory,
    updateCategory
  }
} 