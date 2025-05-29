import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Place } from '../types'
import type { Category } from './useCategories'

interface PlacesByCategory {
  [categoryId: string]: {
    category: Category
    places: Place[]
  }
}

export const usePlacesByCategory = (locationId: string | undefined) => {
  const [placesByCategory, setPlacesByCategory] = useState<PlacesByCategory>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!locationId) return

    let unsubscribe: (() => void) | undefined

    const fetchAllPlaces = async () => {
      try {
        // Получаем все категории этой локации
        const categoriesSnap = await getDocs(query(collection(db, 'categories'), where('locationId', '==', locationId)))
        const categories = categoriesSnap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          locationId: doc.data().locationId,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }))

        if (!categories.length) {
          setPlacesByCategory({})
          setLoading(false)
          return
        }

        // Инициализируем объект с категориями
        const initialPlacesByCategory: PlacesByCategory = {}
        categories.forEach(category => {
          initialPlacesByCategory[category.id] = {
            category,
            places: []
          }
        })

        // Получаем все места для этих категорий
        const q = query(collection(db, 'places'), where('categoryId', 'in', categories.map(c => c.id)))
        unsubscribe = onSnapshot(q, (snapshot) => {
          const places = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            visited: !!doc.data().visited,
            categoryId: doc.data().categoryId,
            photos: doc.data().photos || [],
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
          }))

          // Группируем места по категориям
          const groupedPlaces = { ...initialPlacesByCategory }
          places.forEach(place => {
            if (groupedPlaces[place.categoryId]) {
              // Находим индекс существующего места
              const existingIndex = groupedPlaces[place.categoryId].places.findIndex(p => p.id === place.id)
              if (existingIndex !== -1) {
                // Обновляем существующее место
                groupedPlaces[place.categoryId].places[existingIndex] = place
              } else {
                // Добавляем новое место
                groupedPlaces[place.categoryId].places.push(place)
              }
            }
          })

          setPlacesByCategory(groupedPlaces)
          setLoading(false)
        }, (error) => {
          console.error('Error fetching places:', error)
          setLoading(false)
        })
      } catch (error) {
        console.error('Error fetching categories:', error)
        setLoading(false)
      }
    }

    fetchAllPlaces()

    // Отписываемся от изменений при размонтировании
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [locationId])

  const toggleVisited = async (placeId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'places', placeId), { visited: !current, updatedAt: Timestamp.now() })
    } catch (error) {
      console.error('Error updating visit status:', error)
      alert('Ошибка обновления статуса посещения')
    }
  }

  const categories = Object.values(placesByCategory)
  const totalPlaces = categories.reduce((sum, { places }) => sum + places.length, 0)

  return {
    placesByCategory,
    loading,
    categories,
    totalPlaces,
    toggleVisited
  }
}