import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useNavigateBack } from '../hooks/useNavigateBack'

export const AllPlacesPage = () => {
  useNavigateBack()
  const { id } = useParams<{ id: string }>()
  const [places, setPlaces] = useState<{ id: string, name: string, visited: boolean }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    // Получаем все категории этой локации
    const fetchAllPlaces = async () => {
      const categoriesSnap = await getDocs(query(collection(db, 'categories'), where('locationId', '==', id)))
      const categoryIds = categoriesSnap.docs.map(doc => doc.id)
      if (!categoryIds.length) {
        setPlaces([])
        setLoading(false)
        return
      }
      // Получаем все места для этих категорий
      const q = query(collection(db, 'places'), where('categoryId', 'in', categoryIds))
      onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          visited: !!doc.data().visited,
        }))
        setPlaces(list)
        setLoading(false)
      })
    }
    fetchAllPlaces()
  }, [id])

  const handleToggleVisited = async (placeId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'places', placeId), { visited: !current, updatedAt: Timestamp.now() })
    } catch (err) {
      alert('Ошибка обновления статуса посещения')
    }
  }

  return (
    <div>
      <h2>Все места локации</h2>
      {loading ? (
        <div>Загрузка мест...</div>
      ) : !places.length ? (
        <div>Нет добавленных мест</div>
      ) : (
        <ul>
          {places.map(place => (
            <li key={place.id} style={{ opacity: place.visited ? 0.5 : 1, textDecoration: place.visited ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={place.visited}
                onChange={() => handleToggleVisited(place.id, place.visited)}
                style={{ marginRight: 12 }}
              />
              <Link to={`/place/${place.id}`}>{place.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 