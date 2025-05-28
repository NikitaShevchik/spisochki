import { useEffect, useState } from 'react'
import { collection, onSnapshot, QueryDocumentSnapshot, type DocumentData, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { sendBotMessage } from '../uikit/telegram-bot'

interface Country {
  id: string
  name: string
}

let countriesCache: Country[] | null = null

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>(countriesCache || [])
  const [loading, setLoading] = useState(!countriesCache)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (countriesCache) {
      setCountries(countriesCache)
      setLoading(false)
    }

    const unsubscribe = onSnapshot(
      collection(db, 'countries'),
      (snapshot) => {
        const list = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          name: doc.data().name,
        }))
        setCountries(list)
        countriesCache = list
        setLoading(false)

      },
      (error) => {
        console.error('Error fetching countries:', error)
        setError(error as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const createCountry = async (name: string) => {
    try {
      const docRef = await addDoc(collection(db, 'countries'), { name })
      sendBotMessage(`🌍 Добавлена новая страна: <b>${name}</b>`)
      const newCountry = { id: docRef.id, name }
      setCountries(prev => [...prev, newCountry])
      return newCountry
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create country')
    }
  }

  const deleteCountry = async (id: string) => {
    const country = countries.find(country => country.id === id)
    try {
      await deleteDoc(doc(db, 'countries', id))
      setCountries(prev => prev.filter(country => country.id !== id))
      sendBotMessage(`🌍 Удалена страна: <b>${country?.name}</b>`)
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete country')
    }
  }

  const updateCountry = async (id: string, newName: string) => {
    try {
      await updateDoc(doc(db, 'countries', id), { name: newName })
      setCountries(prev =>
        prev.map(country =>
          country.id === id ? { ...country, name: newName } : country
        )
      )
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update country')
    }
  }

  const isEmpty = countries.length === 0

  return {
    countries,
    loading,
    error,
    isEmpty,
    createCountry,
    deleteCountry,
    updateCountry
  }
} 