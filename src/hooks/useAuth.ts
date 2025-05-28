import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const APP_PASSWORD_DOC_ID = 'app_password'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем, есть ли сохраненный токен авторизации
    const token = localStorage.getItem('auth_token')
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const authenticate = async (password: string) => {
    try {
      // Получаем правильный пароль из Firestore
      const passwordDoc = await getDoc(doc(db, 'config', APP_PASSWORD_DOC_ID))

      if (!passwordDoc.exists()) {
        throw new Error('Password configuration not found')
      }

      const correctPassword = passwordDoc.data().value

      if (password === correctPassword) {
        // Генерируем простой токен и сохраняем его
        const token = Math.random().toString(36).substring(2)
        localStorage.setItem('auth_token', token)
        setIsAuthenticated(true)
        return true
      } else {
        throw new Error('Invalid password')
      }
    } catch (error) {
      console.error('Auth error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoading,
    authenticate,
    logout
  }
} 