
import { useParams, useNavigate } from 'react-router-dom'
import { useLocations } from '../hooks/useLocations'
import { CardList, PageWrapper } from '../uikit/uikit'
import { H2, Text } from '../uikit/typography'
import Loader from '../components/Loader'
import { useCountries } from '../hooks/useCountries'
import { hapticFeedback } from '../utils/telegram'
import { useNavigateBack } from '../hooks/useNavigateBack'
import { EditableCard } from '../components/EditableCard'
import { useEditableItem } from '../hooks/useEditableItem'
import CountryForm from '../components/Forms/CountryForm'

export const CountryPage = () => {
  useNavigateBack()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { countries } = useCountries()
  const { locations, loading, createLocation, deleteLocation, updateLocation } = useLocations(id)
  const selectedCountry = countries.find(country => country.id === id)

  const { editingId, handleDelete, handleEdit, handleSave } = useEditableItem({
    onDelete: deleteLocation,
    onUpdate: updateLocation
  })

  if (loading) {
    return <Loader />
  }

  return (
    <PageWrapper>
      <H2>{selectedCountry?.name}</H2>
      {locations.length === 0 ? (
        <Text>Нет добавленных локаций</Text>
      ) : (
        <CardList>
          {locations.map(loc => (
            <EditableCard
              key={loc.id}
              id={loc.id}
              content={loc.name}
              editingId={editingId}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSave={handleSave}
              handleClick={() => {
                hapticFeedback('light')
                navigate(`/location/${loc.id}`)
              }}
            />
          ))}
        </CardList>
      )}
      <CountryForm createLocation={createLocation} />
    </PageWrapper>
  )
} 