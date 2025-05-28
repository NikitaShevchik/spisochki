import { styled } from 'styled-components'
import { ActionButton, colors, Input } from '../uikit/uikit'

const AddCountryForm = ({ value, setValue, isLoading, error, handleClose, handleSubmit }: {
  value: string,
  setValue: (value: string) => void,
  isLoading: boolean,
  error: string,
  handleClose: () => void,
  handleSubmit: () => void
}) => {
  return (
    <Wrapper>
      <Input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder="Название страны" disabled={isLoading} />
      {error && <div style={{ color: '#f44336', marginTop: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <ActionButton disabled={isLoading || !value.trim()} onClick={handleSubmit} style={{ backgroundColor: colors.pink }}>
          {isLoading ? 'Добавление...' : 'Добавить'}
        </ActionButton>
        <ActionButton onClick={() => handleClose()}>Отмена</ActionButton>
      </div>
    </Wrapper>
  )
}

export default AddCountryForm;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

