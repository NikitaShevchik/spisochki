import React from 'react'
import { colors } from './uikit'
import styled from 'styled-components'
import checkIcon from '../components/Icons/check.svg'

const Checkbox = ({ checked, onChange, style }: { checked: boolean, onChange: (checked: boolean) => void, style?: React.CSSProperties }) => {
  return (
    <Wrapper style={{ ...style, background: checked ? colors.pink : "", borderColor: checked ? colors.pink : colors.border }} onClick={() => onChange(!checked)}>
      {checked && <img src={checkIcon} alt="check" style={{ width: 15, height: 15 }} />}
    </Wrapper>
  )
}

export default Checkbox

const Wrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 1px solid ${colors.border};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`

