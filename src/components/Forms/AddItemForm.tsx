import styled from 'styled-components';
import { ActionButton, colors, Input } from '../../uikit/uikit';
import { H2 } from '../../uikit/typography';

const AddItemForm = ({ title, value, placeholder, setValue, isLoading, error, handleSubmit }: {
  title: string,
  value: string,
  placeholder: string,
  setValue: (value: string) => void,
  isLoading: boolean,
  error: string,
  handleSubmit: () => void
}) => {
  return (
    <Wrapper>
      <H2 style={{ textAlign: 'center' }}>{title}</H2>
      <Input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} disabled={isLoading} />
      {error && <div style={{ color: '#f44336', marginTop: 8 }}>{error}</div>}
      <ActionButton disabled={isLoading || !value.trim()} onClick={handleSubmit} style={{ backgroundColor: colors.pink }}>
        {isLoading ? 'Добавление...' : 'Добавить'}
      </ActionButton>
    </Wrapper>
  )
}

export default AddItemForm;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  background-color: ${colors.white};
  padding: 24px 16px;
  border-radius: 16px;
`

