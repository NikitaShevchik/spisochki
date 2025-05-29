import { useState, useRef } from 'react'
import { Input, ActionButton, colors, InputTextarea } from '../../uikit/uikit'
import styled from 'styled-components'
import { H2 } from '../../uikit/typography'
import { usePhotos } from '../../hooks/usePhotos'
import type { Place } from '../../types'

interface AddPlaceFormProps {
  onSubmit: (placeData: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>
  onCancel: () => void
  categoryId: string
}

export const AddPlaceForm = ({ onSubmit, onCancel, categoryId }: AddPlaceFormProps) => {
  const [placeName, setPlaceName] = useState('')
  const [placeDescription, setPlaceDescription] = useState('')
  const [placeAddress, setPlaceAddress] = useState('')
  const [placeInstagram, setPlaceInstagram] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadPhoto, uploading, error: photoError, MAX_PHOTOS } = usePhotos()

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    if (photos.length + files.length > MAX_PHOTOS) {
      setErrorMessage(`Можно загрузить максимум ${MAX_PHOTOS} фотографий`)
      return
    }

    try {
      const newPhotos = await Promise.all(
        Array.from(files).map(file => uploadPhoto(file))
      )
      setPhotos(prev => [...prev, ...newPhotos])
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка загрузки фото')
    }
  }

  const handleSubmit = async () => {
    if (!placeName.trim()) return
    setAdding(true)
    setErrorMessage(null)
    try {
      await onSubmit({
        name: placeName.trim(),
        description: placeDescription.trim(),
        address: placeAddress.trim(),
        instagram: placeInstagram.trim(),
        categoryId,
        visited: false,
        photos,
      })
      setPlaceName('')
      setPlaceDescription('')
      setPlaceAddress('')
      setPlaceInstagram('')
      setPhotos([])
      onCancel()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка добавления')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Wrapper>
      <H2 style={{ textAlign: 'center' }}>Добавить место</H2>
      <Input
        type="text"
        value={placeName}
        onChange={e => setPlaceName(e.target.value)}
        placeholder="Название места"
        disabled={adding || uploading}
      />
      <InputTextarea
        value={placeDescription}
        onChange={e => setPlaceDescription(e.target.value)}
        placeholder="Описание"
        disabled={adding || uploading}
      />
      <Input
        type="text"
        value={placeAddress}
        onChange={e => setPlaceAddress(e.target.value)}
        placeholder="Адрес"
        disabled={adding || uploading}
      />
      <Input
        type="text"
        value={placeInstagram}
        onChange={e => setPlaceInstagram(e.target.value)}
        placeholder="Инстаграм ссылка"
        disabled={adding || uploading}
      />

      <PhotoUploadSection>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          disabled={adding || uploading || photos.length >= MAX_PHOTOS}
        />
        <ActionButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={adding || uploading || photos.length >= MAX_PHOTOS}
          style={{ backgroundColor: colors.nudePink }}
        >
          {uploading ? 'Загрузка...' : `Добавить фото (${photos.length}/${MAX_PHOTOS})`}
        </ActionButton>
        {photos.length > 0 && (
          <PhotoPreview>
            {photos.map((photo, index) => (
              <PhotoItem key={index}>
                <img src={photo} alt={`Фото ${index + 1}`} />
                <button
                  onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                  disabled={adding || uploading}
                >
                  ✕
                </button>
              </PhotoItem>
            ))}
          </PhotoPreview>
        )}
      </PhotoUploadSection>

      {(errorMessage || photoError) && (
        <ErrorMessage>
          {errorMessage || photoError?.message}
        </ErrorMessage>
      )}

      <ActionButton
        style={{ backgroundColor: colors.pink }}
        onClick={handleSubmit}
        disabled={adding || uploading || !placeName.trim()}
      >
        {adding ? 'Добавление...' : 'Добавить'}
      </ActionButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  background-color: ${colors.white};
  padding: 24px 16px;
  border-radius: 16px;
`

const PhotoUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PhotoPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`

const PhotoItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`

const ErrorMessage = styled.div`
  color: #f44336;
  text-align: center;
`

