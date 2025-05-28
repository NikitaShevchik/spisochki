import { useState } from 'react'
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { ActionButton } from '../uikit/uikit'
import AddCountryForm from './AddCountryForm'

export const AddCountryButton = () => {
  const [showForm, setShowForm] = useState(false)
  const [countryName, setCountryName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkCollection = async () => {
    try {
      const countriesRef = collection(db, 'countries')
      await getDocs(countriesRef)
      return true
    } catch (e) {
      return false
    }
  }

  const handleSubmit = async () => {
    if (!countryName.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const collectionExists = await checkCollection()
      if (!collectionExists) {
        throw new Error('Cannot access Firestore collection')
      }

      const countriesRef = collection(db, 'countries')

      await addDoc(countriesRef, {
        name: countryName.trim(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })

      setCountryName('')
      setShowForm(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create country')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!showForm && <ActionButton style={{ width: '20%', margin: '0 auto' }} onClick={() => setShowForm(true)}>+</ActionButton>}

      {showForm && (
        <AddCountryForm
          value={countryName}
          setValue={setCountryName}
          isLoading={isLoading}
          error={error || ""}
          handleClose={() => setShowForm(false)}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  )
} 