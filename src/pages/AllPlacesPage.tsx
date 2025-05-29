import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { H2, Text } from '../uikit/typography'
import PlaceItem from '../components/PlaceItem'
import { useNavigateBack } from '../hooks/useNavigateBack'
import { usePlacesByCategory } from '../hooks/usePlacesByCategory'
import { CardList, PageWrapper, PlacesCount, colors } from '../uikit/uikit'

export const AllPlacesPage = () => {
  useNavigateBack()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { loading, categories, totalPlaces, toggleVisited } = usePlacesByCategory(id)

  if (loading) return <Loader />

  return (
    <PageWrapper>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <H2>Все места</H2>
        {totalPlaces > 10 && <PlacesCount>{totalPlaces}</PlacesCount>}
      </div>
      {!categories.length ? (
        <Text>Нет добавленных мест</Text>
      ) : (
        <CategoriesList>
          {categories.map(({ category, places }) => (
            <CategorySection key={category.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <H2 style={{ color: colors.pink }}>{category.name}</H2>
                {places.length > 10 && <PlacesCount>{places.length}</PlacesCount>}
              </div>
              {places.length > 0 ? (
                <CardList>
                  {places.map(place => (
                    <PlaceItem key={place.id} place={place} toggleVisited={toggleVisited} navigate={navigate} />
                  ))}
                </CardList>
              ) : (
                <Text style={{ textAlign: 'center', opacity: 0.5 }}>Нет добавленных мест</Text>
              )}
            </CategorySection>
          ))}
        </CategoriesList>
      )}
    </PageWrapper>
  )
}

const CategoriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`