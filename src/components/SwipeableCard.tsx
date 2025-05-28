import { motion, useMotionValue, useAnimation } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import styled from 'styled-components'
import { colors } from '../uikit/uikit'

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
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
`

export const DeleteButton = styled(ActionButton)`
  right: 0;
  background-color: ${colors.red};
  border-radius: 0 48px 48px 0;
  color: ${colors.black};
`

const EditButton = styled(ActionButton)`
  right: 80px;
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
  touch-action: pan-y;
  position: relative;
  z-index: 1;
  background: ${colors.pink};
`

interface SwipeableCardProps {
  children: React.ReactNode
  onDelete: () => void
  onEdit: () => void
}

export const SwipeableCard = ({ children, onDelete, onEdit }: SwipeableCardProps) => {
  const x = useMotionValue(0)
  const controls = useAnimation()

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = -100
    if (info.offset.x < threshold) {
      await controls.start({ x: -130 })
    } else {
      await controls.start({ x: 0 })
    }
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
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
      >
        {children}
      </CardContent>
    </CardContainer>
  )
} 