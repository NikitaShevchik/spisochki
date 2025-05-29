import { useState } from 'react'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const MAX_PHOTOS = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024

export const usePhotos = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadPhoto = async (file: File): Promise<string> => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Файл слишком большой. Максимальный размер: 5MB')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Можно загружать только изображения')
    }

    setUploading(true)
    setError(null)

    try {
      const storage = getStorage()
      const timestamp = Date.now()
      const fileName = `${timestamp}_${file.name}`
      const storageRef = ref(storage, `places/${fileName}`)

      await uploadBytes(storageRef, file)

      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка загрузки фото')
      setError(error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const deletePhoto = async (photoUrl: string) => {
    try {
      const storage = getStorage()
      const photoRef = ref(storage, photoUrl)
      await deleteObject(photoRef)
    } catch (err) {
      console.error('Error deleting photo:', err)
      throw err instanceof Error ? err : new Error('Ошибка удаления фото')
    }
  }

  return {
    uploadPhoto,
    deletePhoto,
    uploading,
    error,
    MAX_PHOTOS
  }
} 