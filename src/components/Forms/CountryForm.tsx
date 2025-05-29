import { useState } from 'react'
import { hapticFeedback } from '../../utils/telegram'
import AddItemForm from './AddItemForm'
import ModalWrapper from '../Modal/ModalWrapper'
import { ActionButton } from '../../uikit/uikit'
import type { CreateLocationData } from '../../hooks/useLocations'

const CountryForm = ({ createLocation }: { createLocation: (data: CreateLocationData) => Promise<string> }) => {
  const [adding, setAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [locationName, setLocationName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async () => {
    if (!locationName.trim()) return
    setAdding(true)
    setErrorMessage(null)
    try {
      await createLocation({ name: locationName })
      setLocationName('')
      setShowForm(false)
      hapticFeedback('light')
    } catch (err) {
      console.log(err)
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка добавления')
      hapticFeedback('light')
    } finally {
      setAdding(false)
    }
  }

  return showForm ? (
    <ModalWrapper handleClose={() => {
      hapticFeedback('light')
      setShowForm(false)
    }}>
      <AddItemForm
        title="Добавить локацию"
        value={locationName}
        setValue={setLocationName}
        isLoading={adding}
        error={errorMessage || ''}
        handleSubmit={handleSubmit}
        placeholder="Название локации"
      />
    </ModalWrapper>
  ) : (
    <ActionButton
      style={{ width: '20%', margin: '0 auto' }}
      onClick={() => {
        hapticFeedback('light')
        setShowForm(true)
      }}
    >
      +
    </ActionButton>
  )
}

export default CountryForm