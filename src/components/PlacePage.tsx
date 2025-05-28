import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useNavigateBack } from '../hooks/useNavigateBack'

export const PlacePage = () => {
  useNavigateBack()
  const { id } = useParams<{ id: string }>()
  const [place, setPlace] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchPlace = async () => {
      const docRef = doc(db, 'places', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setPlace(docSnap.data())
      }
      setLoading(false)
    }
    fetchPlace()
  }, [id])

  if (loading) return <div>Загрузка...</div>
  if (!place) return <div>Место не найдено</div>

  return (
    <div>
      <h2>{place.name}</h2>
      <div><b>Описание:</b> {place.description}</div>
      <div><b>Адрес:</b> {place.address}</div>
      <div><b>Посещено:</b> {place.visited ? 'Да' : 'Нет'}</div>
      <div><b>Категория:</b> {place.categoryId}</div>
      <div><b>Создано:</b> {place.createdAt?.toDate ? place.createdAt.toDate().toLocaleString() : ''}</div>
      <div><b>Обновлено:</b> {place.updatedAt?.toDate ? place.updatedAt.toDate().toLocaleString() : ''}</div>
    </div>
  )
} 