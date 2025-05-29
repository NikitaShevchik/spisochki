import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlaces } from '../hooks/usePlaces'
import { PageWrapper, ActionButton, CardList } from '../uikit/uikit'
import { useNavigateBack } from '../hooks/useNavigateBack'
import ModalWrapper from '../components/Modal/ModalWrapper'
import { AddPlaceForm } from '../components/Forms/AddPlaceForm'
import { useCategories } from '../hooks/useCategories'
import { H2, Text } from '../uikit/typography'
import Loader from '../components/Loader'
import { hapticFeedback } from '../utils/telegram'
import PlaceItem from '../components/PlaceItem'

export const CategoryPage = () => {
  useNavigateBack()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { places, loading, error, isEmpty, addPlace, toggleVisited } = usePlaces(id)
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const [showForm, setShowForm] = useState(false)

  const category = categories.find(c => c.id === id)

  if (loading || categoriesLoading) return <Loader />
  if (error || categoriesError) return <Text>Ошибка: {error?.message || categoriesError?.message}</Text>

  return (
    <PageWrapper>
      <H2>{category?.name}</H2>
      {isEmpty ? (
        <Text>Нет добавленных мест</Text>
      ) : (
        <CardList>
          {places.map(place => (
            <PlaceItem key={place.id} place={place} toggleVisited={toggleVisited} navigate={navigate} />
          ))}
        </CardList>
      )}
      {showForm ? (
        <ModalWrapper handleClose={() => setShowForm(false)}>
          <AddPlaceForm onSubmit={addPlace} onCancel={() => setShowForm(false)} categoryId={id!} />
        </ModalWrapper>
      ) : (
        <ActionButton style={{ width: '20%', margin: '0 auto' }} onClick={() => { hapticFeedback('light'); setShowForm(true) }}>
          +
        </ActionButton>
      )}
    </PageWrapper>
  )
}

