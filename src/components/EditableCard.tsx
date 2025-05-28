import { useState } from 'react'
import styled from 'styled-components'
import { colors } from '../uikit/uikit'
import { SwipeableCard } from './SwipeableCard'
import { Input } from '../uikit/uikit'

const SaveInputCardButton = styled.button`
  top: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: ${colors.black};
  background: ${colors.pink};
  font-weight: bold;
  cursor: pointer;
  padding: 0 20px;
  border-radius: 0 48px 48px 0;
  z-index: 0;
`

interface EditableCardProps {
  id: string
  content: string
  editingId: string | null
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onSave: (id: string, newValue: string) => void
  onClick?: () => void
}

export const EditableCard = ({
  id,
  content,
  editingId,
  onDelete,
  onEdit,
  onSave,
  onClick
}: EditableCardProps) => {
  const [editValue, setEditValue] = useState(content)

  const handleSave = () => {
    if (editValue.trim()) {
      onSave(id, editValue.trim())
    }
  }

  if (editingId === id) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Input
          style={{ borderRadius: '48px 0 0 48px' }}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <SaveInputCardButton onClick={handleSave}>
          Save
        </SaveInputCardButton>
      </div>
    )
  }

  return (
    <SwipeableCard
      onDelete={() => onDelete(id)}
      onEdit={() => onEdit(id)}
    >
      <div onClick={onClick}>
        {content}
      </div>
    </SwipeableCard>
  )
} 