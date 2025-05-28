import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLocations } from '../hooks/useLocations'
import { Card, CardList, colors, PageWrapper } from '../uikit/uikit'
import { H2, Text } from '../uikit/typography'
import Loader from '../components/Loader'
import { useCountries } from '../hooks/useCountries'
import AddLocationForm from '../components/AddLocationForm'
import { hapticFeedback } from '../utils/telegram'
import { useNavigateBack } from '../hooks/useNavigateBack'

export const CountryPage = () => {
  useNavigateBack()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { countries } = useCountries()
  const { locations, loading, createLocation } = useLocations(id)
  const [showForm, setShowForm] = useState(false)
  const [locationName, setLocationName] = useState('')
  const [adding, setAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const selectedCountry = countries.find(country => country.id === id)

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
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка добавления')
      hapticFeedback('light')
    } finally {
      setAdding(false)
    }
  }

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
            <Card
              key={loc.id}
              onClick={() => {
                hapticFeedback('light')
                navigate(`/location/${loc.id}`)
              }}
            >
              {loc.name}
            </Card>
          ))}
        </CardList>
      )}
      {showForm ? (
        <AddLocationForm
          value={locationName}
          setValue={setLocationName}
          isLoading={adding}
          error={errorMessage || ''}
          handleClose={() => {
            hapticFeedback('light')
            setShowForm(false)
          }}
          handleSubmit={handleSubmit}
        />
      ) : (
        <Card
          style={{ backgroundColor: colors.nudePink }}
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