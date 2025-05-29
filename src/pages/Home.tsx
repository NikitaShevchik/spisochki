import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { useCountries } from '../hooks/useCountries'
import { CardList, PageWrapper } from '../uikit/uikit'
import { AddCountryButton } from '../components/AddCountryButton'
import { hapticFeedback, telegramWebApp, isTelegramWebApp } from '../utils/telegram'
import { useEffect } from 'react'
import { H2 } from '../uikit/typography'
import { EditableCard } from '../components/EditableCard'
import { useEditableItem } from '../hooks/useEditableItem'

const Home = () => {
  const navigate = useNavigate()
  const { countries, loading, error, isEmpty, deleteCountry, updateCountry } = useCountries()

  const { editingId, handleDelete, handleEdit, handleSave } = useEditableItem({
    onDelete: deleteCountry,
    onUpdate: updateCountry
  })

  useEffect(() => {
    if (isTelegramWebApp()) {
      telegramWebApp.BackButton.hide()
    }
  }, [])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <PageWrapper>
      <H2>Страны</H2>
      {!isEmpty ? (
        <CardList>
          {countries.map((country) => (
            <EditableCard
              key={country.id}
              id={country.id}
              content={country.name}
              editingId={editingId}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSave={handleSave}
              handleClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                hapticFeedback('light')
                navigate(`/country/${country.id}`)
              }}
            />
          ))}
        </CardList>
      ) : (
        <div>No countries 🌍</div>
      )}
      <AddCountryButton />
    </PageWrapper>
  )
}

export default Home
