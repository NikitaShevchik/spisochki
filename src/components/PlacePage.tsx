import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useNavigateBack } from '../hooks/useNavigateBack'
import { PageWrapper, colors } from '../uikit/uikit'
import { H2 } from '../uikit/typography'
import styled from 'styled-components'
import type { Place } from '../types'

export const PlacePage = () => {
  useNavigateBack()
  const { id } = useParams<{ id: string }>()
  const [place, setPlace] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchPlace = async () => {
      const docRef = doc(db, 'places', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setPlace({
          id: docSnap.id,
          name: docSnap.data().name,
          description: docSnap.data().description,
          address: docSnap.data().address,
          instagram: docSnap.data().instagram,
          categoryId: docSnap.data().categoryId,
          visited: docSnap.data().visited,
          photos: docSnap.data().photos || [],
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        })
      }
      setLoading(false)
    }
    fetchPlace()
  }, [id])

  if (loading) return <div>Загрузка...</div>
  if (!place) return <div>Место не найдено</div>

  return (
    <PageWrapper>
      <H2>{place.name}</H2>

      {place.photos.length > 0 && (
        <PhotoGallery>
          {place.photos.map((photo: string, index: number) => (
            <PhotoItem key={index}>
              <img src={photo} alt={`Фото ${index + 1}`} />
            </PhotoItem>
          ))}
        </PhotoGallery>
      )}

      <InfoSection>
        {place.description && (
          <InfoItem>
            <InfoLabel>Описание:</InfoLabel>
            <InfoValue>{place.description}</InfoValue>
          </InfoItem>
        )}

        {place.address && (
          <InfoItem>
            <InfoLabel>Адрес:</InfoLabel>
            <InfoValue>{place.address}</InfoValue>
          </InfoItem>
        )}

        {place.instagram && (
          <InfoItem>
            <InfoLabel>Instagram:</InfoLabel>
            <InfoValue>
              <a
                href={place.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.pink, textDecoration: 'none' }}
              >
                {place.instagram}
              </a>
            </InfoValue>
          </InfoItem>
        )}

        <InfoItem>
          <InfoLabel>Посещено:</InfoLabel>
          <InfoValue>{place.visited ? 'Да' : 'Нет'}</InfoValue>
        </InfoItem>

        <InfoItem>
          <InfoLabel>Создано:</InfoLabel>
          <InfoValue>{place.createdAt?.toLocaleString()}</InfoValue>
        </InfoItem>

        <InfoItem>
          <InfoLabel>Обновлено:</InfoLabel>
          <InfoValue>{place.updatedAt?.toLocaleString()}</InfoValue>
        </InfoItem>
      </InfoSection>
    </PageWrapper>
  )
}

const PhotoGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
  margin-bottom: 24px;
`

const PhotoItem = styled.div`
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  background: ${colors.nudePink};
  padding: 24px;
  border-radius: 16px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const InfoLabel = styled.div`
  font-weight: 600;
  color: ${colors.black};
  opacity: 0.7;
`

const InfoValue = styled.div`
  color: ${colors.black};
` 