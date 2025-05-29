import { useState } from 'react'
import styled from 'styled-components'
import { colors } from '../uikit/uikit'
import { Input } from '../uikit/uikit'
import { H2 } from '../uikit/typography'
import { PageWrapper } from '../uikit/uikit'
import { hapticFeedback } from '../utils/telegram'
import { useNavigate } from 'react-router-dom'

export const AuthPage = ({ onAuth }: { onAuth: (password: string) => Promise<boolean> }) => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Введите пароль')
      hapticFeedback('heavy')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await onAuth(password)
      if (success) {
        hapticFeedback('medium')
        navigate('/')
      }
    } catch (err) {
      console.log(err)
      setError('Неверный пароль')
      hapticFeedback('heavy')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageWrapper>
      <H2>Авторизация</H2>
      <AuthForm onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Проверка...' : 'Войти'}
        </SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </AuthForm>
    </PageWrapper>
  )
}

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;
`

const SubmitButton = styled.button`
  background: ${colors.pink};
  border-radius: 48px;
  padding: 16px;
  width: 100%;
  border: none;
  outline: none;
  color: ${colors.black};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  color: ${colors.red};
  text-align: center;
  font-size: 14px;
`
