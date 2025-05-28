declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        isExpanded: boolean
        onEvent: (eventType: string, eventHandler: () => void) => void
        offEvent: (eventType: string, eventHandler: () => void) => void
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void
        enableClosingConfirmation: () => void
        viewportStableHeight: number
        BackButton: {
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
        }
        MainButton: {
          show: () => void
          hide: () => void
          setText: (text: string) => void
          onClick: (callback: () => void) => void
        }
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
        }
      }
    }
  }
}

export const telegramWebApp = window.Telegram.WebApp

export const isTelegramWebApp = () => {
  return window.Telegram?.WebApp !== undefined
}

export const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
  if (isTelegramWebApp()) {
    telegramWebApp.HapticFeedback.impactOccurred(style)
  }
} 