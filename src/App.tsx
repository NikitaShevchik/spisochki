import { useEffect } from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CountryPage } from './pages/CountryPage'
import { LocationPage } from './components/LocationPage'
import { PlacePage } from './components/PlacePage'
import { AllPlacesPage } from './pages/AllPlacesPage'
import { CategoryPage } from './components/CategoryPage'
import { telegramWebApp } from './utils/telegram'
import Loader from './components/Loader'
import Home from './pages/Home'
import { AuthPage } from './pages/AuthPage'
import { useAuth } from './hooks/useAuth'

const AppContainer = styled.div`
  -webkit-overflow-scrolling: touch;
`

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()


  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function App() {
  const { authenticate } = useAuth()

  useEffect(() => {
    telegramWebApp.enableClosingConfirmation()
    telegramWebApp.ready()
    telegramWebApp.expand()
  }, [])

  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/auth" element={<AuthPage onAuth={authenticate} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/country/:id"
            element={
              <ProtectedRoute>
                <CountryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/location/:id"
            element={
              <ProtectedRoute>
                <LocationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/location/:id/all"
            element={
              <ProtectedRoute>
                <AllPlacesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:id"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/place/:id"
            element={
              <ProtectedRoute>
                <PlacePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContainer>
    </Router>
  )
}

export default App
