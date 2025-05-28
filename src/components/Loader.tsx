import styled, { keyframes } from 'styled-components'
import { Text } from '../uikit/typography'

const Loader = ({ text }: { text?: string }) => {
  return (
    <Wrapper>
      <Rotate>
        <div>📝</div>
      </Rotate>
      {text && <Text>{text}</Text>}
    </Wrapper>
  )
}

export default Loader

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  z-index: 1000;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  padding: 2rem 1rem;
  font-size: 1.2rem;
`;


