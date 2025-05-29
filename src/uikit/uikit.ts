import styled from "styled-components";

export const colors = {
  pink: '#FFAAE8',
  black: '#2D2D2D',
  white: '#FFFFFF',
  nudePink: '#FDE0F3',
  gray: '#2D2D2D50',
  disabled: '#a1a9ba',
  red: '#FFABAB',
  border: "#CDCFD0"
}

export const Card = styled.div`
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
`

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: hidden;
  padding: 24px;
  gap: 16px;
  min-height: 100vh;
`

export const ActionButton = styled.button`
  background: ${colors.nudePink};
  border-radius: 48px;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  color: ${colors.black};
  cursor: pointer;
  transition: all 0.3s ease;
  &:disabled {
    opacity: 0.3;
    background: ${colors.disabled} !important;
    cursor: not-allowed;
  }
`

export const Input = styled.input`
  background: ${colors.nudePink};
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  border: none;
  outline: none;
  color: ${colors.black};
`

export const InputTextarea = styled.textarea`
  background: ${colors.nudePink};
  font-family: 'Inter', sans-serif;
  border-radius: 12px;
  padding: 16px;
  height: 80px;
  width: 100%;
  border: none;
  outline: none;
  color: ${colors.black};
  resize: none;
`

export const PinkCheckbox = styled.input`
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 1px solid ${colors.border};
  cursor: pointer;
  &:checked {
    background: ${colors.pink};
    border-color: ${colors.pink};
  }
`

export const PlacesCount = styled.div`
  background: ${colors.pink};
  color: ${colors.black};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
`