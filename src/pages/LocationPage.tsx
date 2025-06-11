import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import { Card, CardList, colors, PageWrapper } from '../uikit/uikit'
import { H2, Text } from '../uikit/typography'
import Loader from '../components/Loader'
import { hapticFeedback } from '../utils/telegram'
import { useNavigateBack } from '../hooks/useNavigateBack'
import { EditableCard } from '../components/EditableCard'
import { useLocations } from '../hooks/useLocations'
import AddItemForm from '../components/Forms/AddItemForm'
import ModalWrapper from '../components/Modal/ModalWrapper'

export const LocationPage = () => {
  useNavigateBack()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { locations } = useLocations()
  const { categories, loading, error, isEmpty, createCategory, deleteCategory, updateCategory } = useCategories(id)
  const [showForm, setShowForm] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [adding, setAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const selectedLocation = locations.find(loc => loc.id === id)

  const handleSubmit = async () => {
    if (!categoryName.trim()) return
    setAdding(true)
    setErrorMessage(null)
    try {
      await createCategory({ name: categoryName })
      setCategoryName('')
      setShowForm(false)
      hapticFeedback('light')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка добавления')
      hapticFeedback('light')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id)
      hapticFeedback('medium')
    } catch (err) {
      console.log(err)
      hapticFeedback('heavy')
    }
  }

  const handleEdit = async (id: string) => {
    setEditingId(id)
  }

  const handleSave = async (id: string, newValue: string) => {
    try {
      await updateCategory(id, newValue)
      hapticFeedback('medium')
    } catch (err) {
      console.log(err)
      hapticFeedback('heavy')
    }
    setEditingId(null)
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <PageWrapper>
      <H2>{selectedLocation?.name || 'Категории локации'}</H2>
      {categories.length > 1 && (
        <Card
          style={{ backgroundColor: 'transparent', border: `2px solid ${colors.pink}` }}
          onClick={() => {
            hapticFeedback('light')
            navigate(`/location/${id}/all`)
          }}
        >
          Все места
        </Card>
      )}
      {isEmpty ? (
        <Text>Нет добавленных категорий</Text>
      ) : (
        <CardList>
          {categories.map(cat => (
            <EditableCard
              key={cat.id}
              id={cat.id}
              content={cat.name}
              editingId={editingId}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSave={handleSave}
              handleClick={() => {
                hapticFeedback('light')
                navigate(`/category/${cat.id}`)
              }}
            />
          ))}
        </CardList>
      )}
      {showForm ? (
        <ModalWrapper handleClose={() => {
          hapticFeedback('light')
          setShowForm(false)
        }}>
          <AddItemForm
            title="Добавить категорию"
            value={categoryName}
            setValue={setCategoryName}
            isLoading={adding}
            error={errorMessage || ''}
            handleSubmit={handleSubmit}
            placeholder="Название категории"
          />
        </ModalWrapper>
      ) : (
        <Card
          style={{ backgroundColor: colors.nudePink, width: '20%', margin: '0 auto' }}
          onClick={() => {
            hapticFeedback('light')
            setShowForm(true)
          }}
        >
          +
        </Card>
      )}
    </PageWrapper>
  )
} 