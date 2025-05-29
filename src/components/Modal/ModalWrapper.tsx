import React from 'react'
import { styled } from 'styled-components'
import closeIcon from '../Icons/close.svg'

const ModalWrapper = ({ children, handleClose }: { children: React.ReactNode, handleClose: () => void }) => {
  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <Wrapper onClick={handleCloseModal}>
      <div style={{ width: '85%', position: 'relative' }}>
        <div onClick={handleClose} style={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer' }}>
          <img src={closeIcon} alt="close" style={{ width: 24, height: 24 }} />
        </div>
        {children}
      </div>
    </Wrapper>
  )
}

export default ModalWrapper

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`
