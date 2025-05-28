import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, Timestamp, QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore'
import { db } from '../firebase/config'

export interface Place {
  id: string
  name: string
  description?: string
  address?: string
  categoryId: string
  visited: boolean
  createdAt: Date
  updatedAt: Date
}

const placesCache: Record<string, Place[]> = {}

export const usePlaces = (categoryId?: string) => {
  const [places, setPlaces] = useState<Place[]>(categoryId ? placesCache[categoryId] || [] : [])
  const [loading, setLoading] = useState(!categoryId || !placesCache[categoryId])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setPlaces([])
      setLoading(false)
      return
    }

    if (placesCache[categoryId]) {
      setPlaces(placesCache[categoryId])
      setLoading(false)
    }

    const q = query(collection(db, 'places'), where('categoryId', '==', categoryId))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          address: doc.data().address,
          categoryId: doc.data().categoryId,
          visited: !!doc.data().visited,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }))
        setPlaces(list)
        placesCache[categoryId] = list
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching places:', error)
        setError(error as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [categoryId])

  const addPlace = async (placeData: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'places'), {
        ...placeData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding place:', err)
      throw err
    }
  }

  const toggleVisited = async (placeId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'places', placeId), {
        visited: !current,
        updatedAt: Timestamp.now()
      })
    } catch (err) {
      console.error('Error toggling visited status:', err)
      throw err
    }
  }

  return {
    places,
    loading,
    error,
    isEmpty: places.length === 0,
    addPlace,
    toggleVisited
  }
} 