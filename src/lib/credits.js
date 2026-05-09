const CREDITS_STORAGE_KEY = 'ai_saas_credits_balance'
const CREDITS_EVENT = 'credits-updated'
const DEFAULT_CREDITS = 120

export const TOOL_CREDIT_COST = {
  writeArticle: 6,
  removeBackground: 5,
  removeObject: 5,
  reviewResume: 8,
}

const isBrowser = typeof window !== 'undefined'

export const getCreditsBalance = () => {
  if (!isBrowser) return DEFAULT_CREDITS

  const rawValue = window.localStorage.getItem(CREDITS_STORAGE_KEY)
  const parsedValue = Number(rawValue)

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    window.localStorage.setItem(CREDITS_STORAGE_KEY, String(DEFAULT_CREDITS))
    return DEFAULT_CREDITS
  }

  return Math.floor(parsedValue)
}

const setCreditsBalance = (value) => {
  if (!isBrowser) return

  const safeValue = Math.max(0, Math.floor(value))
  window.localStorage.setItem(CREDITS_STORAGE_KEY, String(safeValue))
  window.dispatchEvent(new Event(CREDITS_EVENT))
}

export const hasEnoughCredits = (cost) => getCreditsBalance() >= cost

export const consumeCredits = (cost) => {
  const currentBalance = getCreditsBalance()
  if (currentBalance < cost) {
    return false
  }

  setCreditsBalance(currentBalance - cost)
  return true
}

export const onCreditsUpdated = (callback) => {
  if (!isBrowser) return () => {}

  const handleChange = () => callback(getCreditsBalance())
  window.addEventListener(CREDITS_EVENT, handleChange)
  window.addEventListener('storage', handleChange)

  return () => {
    window.removeEventListener(CREDITS_EVENT, handleChange)
    window.removeEventListener('storage', handleChange)
  }
}
