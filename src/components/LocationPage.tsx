import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { collection, query, where, onSnapshot, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useNavigateBack } from '../hooks/useNavigateBack'

export const LocationPage = () => {
  useNavigateBack()
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const q = query(collection(db, 'categories'), where('locationId', '==', id))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }))
      setCategories(list)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [id])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim() || !id) return
    setAdding(true)
    setError(null)
    try {
      await addDoc(collection(db, 'categories'), {
        name: categoryName.trim(),
        locationId: id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      setCategoryName('')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      <h2>Категории локации</h2>
      {loading ? (
        <div>Загрузка категорий...</div>
      ) : !categories.length ? (
        <div>Нет добавленных категорий</div>
      ) : (
        <>
          {categories.length > 1 && (
            <button onClick={() => navigate(`/location/${id}/all`)} style={{ marginBottom: 16, background: '#4CAF50' }}>
              Все
            </button>
          )}
          <ul>
            {categories.map(cat => (
              <li key={cat.id}>
                <Link to={`/category/${cat.id}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {showForm ? (
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            placeholder="Название категории"
            disabled={adding}
          />
          {error && <div style={{ color: '#f44336', marginTop: 8 }}>{error}</div>}
          <button type="submit" disabled={adding || !categoryName.trim()}>
            {adding ? 'Добавление...' : 'Добавить'}
          </button>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}>Добавить категорию</button>
      )}
    </div>
  )
} 