import { motion, useMotionValue, useAnimation } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import styled from 'styled-components'
import { colors } from '../uikit/uikit'
import { hapticFeedback } from '../utils/telegram'

interface SwipeableCardProps {
  children: React.ReactNode
  onDelete: () => void
  onEdit: () => void
  handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const SwipeableCard = ({ children, onDelete, onEdit, handleClick }: SwipeableCardProps) => {
  const x = useMotionValue(0)
  const controls = useAnimation()

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = -100
    if (info.offset.x < threshold) {
      await controls.start({ x: -130 })
      hapticFeedback('medium')
    } else {
      await controls.start({ x: 0 })
      hapticFeedback('light')
    }
  }

  const handleDragStart = (e: MouseEvent | TouchEvent | PointerEvent) => {
    e.stopPropagation()
    hapticFeedback('light')
  }

  return (
    <CardContainer>
      <DeleteButton onClick={onDelete}>
        Delete
      </DeleteButton>
      <EditButton onClick={onEdit}>
        Edit
      </EditButton>
      <CardContent
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        dragDirectionLock={true}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        animate={controls}
        style={{ x }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          handleClick?.(e)
        }}
      >
        {children}
      </CardContent>
    </CardContainer>
  )
}

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  touch-action: pan-x;
`

const ActionButton = styled(motion.button)`
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 0 20px;
  z-index: 0;
  touch-action: none;
`

export const DeleteButton = styled(ActionButton)`
  right: 0;
  background-color: ${colors.red};
  border-radius: 0 48px 48px 0;
  color: ${colors.black};
`

const EditButton = styled(ActionButton)`
  right: 70px;
  background-color: ${colors.nudePink};
  color: ${colors.black};
  width: 80px;
  padding-right: 15px;
  text-align: left;
  justify-content: flex-end;
`

const CardContent = styled(motion.div)`
  background: ${colors.pink};
  border-radius: 48px;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  color: ${colors.black};
  cursor: pointer;
  touch-action: pan-x;
  position: relative;
  z-index: 1;
  background: ${colors.pink};
`
