export const sendBotMessage = async (message: string) => {
  const BOT_TOKEN = "7662732354:AAGrFcdFifhyl1d6GoQPmlZ4hAtOdYY1eLw"
  const CHANNEL_USERNAME = "@pidoras_pedik"

  if (!BOT_TOKEN || !CHANNEL_USERNAME) {
    console.warn('Telegram bot configuration is missing')
    return
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHANNEL_USERNAME,
        text: message,
        parse_mode: 'HTML'
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error sending telegram message:', error)
  }
} 