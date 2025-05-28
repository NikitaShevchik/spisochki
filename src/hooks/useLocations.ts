import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, addDoc, Timestamp, QueryDocumentSnapshot, type DocumentData, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export interface Location {
  id: string
  name: string
  countryId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateLocationData {
  name: string
}

const locationsCache: Record<string, Location[]> = {}
let allLocationsCache: Location[] | null = null

export const useLocations = (countryId?: string) => {
  const [locations, setLocations] = useState<Location[]>(
    countryId
      ? (locationsCache[countryId] || [])
      : (allLocationsCache || [])
  )
  const [loading, setLoading] = useState(
    countryId
      ? !locationsCache[countryId]
      : !allLocationsCache
  )
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (countryId && locationsCache[countryId]) {
      setLocations(locationsCache[countryId])
      setLoading(false)
      return
    }
    if (!countryId && allLocationsCache) {
      setLocations(allLocationsCache)
      setLoading(false)
      return
    }

    // Создаем запрос
    const q = countryId
      ? query(collection(db, 'locations'), where('countryId', '==', countryId))
      : query(collection(db, 'locations'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          name: doc.data().name,
          countryId: doc.data().countryId,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }))
        setLocations(list)

        // Сохраняем в соответствующий кеш
        if (countryId) {
          locationsCache[countryId] = list
        } else {
          allLocationsCache = list
        }

        setLoading(false)
      },
      (error) => {
        console.error('Error fetching locations:', error)
        setError(error as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [countryId])

  const createLocation = async (data: CreateLocationData) => {
    if (!countryId) throw new Error('Country ID is required')
    if (!data.name.trim()) throw new Error('Location name is required')

    try {
      const docRef = await addDoc(collection(db, 'locations'), {
        name: data.name.trim(),
        countryId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding location:', err)
      throw err
    }
  }

  const deleteLocation = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'locations', id))
    } catch (err) {
      console.error('Error deleting location:', err)
      throw err instanceof Error ? err : new Error('Failed to delete location')
    }
  }

  const updateLocation = async (id: string, newName: string) => {
    try {
      await updateDoc(doc(db, 'locations', id), {
        name: newName.trim(),
        updatedAt: Timestamp.now()
      })
    } catch (err) {
      console.error('Error updating location:', err)
      throw err instanceof Error ? err : new Error('Failed to update location')
    }
  }

  return {
    locations,
    loading,
    error,
    createLocation,
    deleteLocation,
    updateLocation
  }
} 