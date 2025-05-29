import { useState } from 'react'
import { hapticFeedback } from '../utils/telegram'

interface UseEditableItemProps {
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, newValue: string) => Promise<void>
}

export const useEditableItem = ({ onDelete, onUpdate }: UseEditableItemProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id)
      hapticFeedback('medium')
    } catch (err) {
      console.error('Error deleting item:', err)
      hapticFeedback('heavy')
    }
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = async (id: string, newValue: string) => {
    try {
      await onUpdate(id, newValue)
      hapticFeedback('medium')
    } catch (err) {
      console.error('Error updating item:', err)
      hapticFeedback('heavy')
    }
    setEditingId(null)
  }

  return {
    editingId,
    handleDelete,
    handleEdit,
    handleSave
  }
} 