import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePlaces } from '../hooks/usePlaces'
import { PageWrapper } from '../uikit/uikit'
import { useNavigateBack } from '../hooks/useNavigateBack'

export const CategoryPage = () => {
  useNavigateBack()
  const { id } = useParams<{ id: string }>()
  const { places, loading, error, isEmpty, addPlace, toggleVisited } = usePlaces(id)
  const [showForm, setShowForm] = useState(false)
  const [placeName, setPlaceName] = useState('')
  const [placeDescription, setPlaceDescription] = useState('')
  const [placeAddress, setPlaceAddress] = useState('')
  const [adding, setAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!placeName.trim() || !id) return
    setAdding(true)
    setErrorMessage(null)
    try {
      await addPlace({
        name: placeName.trim(),
        description: placeDescription.trim(),
        address: placeAddress.trim(),
        categoryId: id,
        visited: false,
      })
      setPlaceName('')
      setPlaceDescription('')
      setPlaceAddress('')
      setShowForm(false)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка добавления')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div>Загрузка мест...</div>
  if (error) return <div>Ошибка: {error.message}</div>

  return (
    <PageWrapper>
      <h2>Места категории</h2>
      {isEmpty ? (
        <div>Нет добавленных мест</div>
      ) : (
        <ul>
          {places.map(place => (
            <li key={place.id} style={{ opacity: place.visited ? 0.5 : 1, textDecoration: place.visited ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={place.visited}
                onChange={() => toggleVisited(place.id, place.visited)}
                style={{ marginRight: 12 }}
              />
              <Link to={`/place/${place.id}`}>{place.name}</Link>
            </li>
          ))}
        </ul>
      )}
      {showForm ? (
        <form onSubmit={handleAddPlace}>
          <div>
            <input
              type="text"
              value={placeName}
              onChange={e => setPlaceName(e.target.value)}
              placeholder="Название места"
              disabled={adding}
            />
          </div>
          <div>
            <input
              type="text"
              value={placeDescription}
              onChange={e => setPlaceDescription(e.target.value)}
              placeholder="Описание"
              disabled={adding}
            />
          </div>
          <div>
            <input
              type="text"
              value={placeAddress}
              onChange={e => setPlaceAddress(e.target.value)}
              placeholder="Адрес"
              disabled={adding}
            />
          </div>
          {errorMessage && <div style={{ color: '#f44336', marginTop: 8 }}>{errorMessage}</div>}
          <button type="submit" disabled={adding || !placeName.trim()}>
            {adding ? 'Добавление...' : 'Добавить'}
          </button>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}>Добавить место</button>
      )}
    </PageWrapper>
  )
} 