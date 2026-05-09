const CREATION_HISTORY_KEY = 'ai_saas_creation_history'
const CREATION_HISTORY_EVENT = 'creations-updated'

const isBrowser = typeof window !== 'undefined'

const readStoredCreations = () => {
  if (!isBrowser) return null

  const rawValue = window.localStorage.getItem(CREATION_HISTORY_KEY)
  if (!rawValue) return null

  try {
    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

const writeCreations = (creations) => {
  if (!isBrowser) return

  window.localStorage.setItem(CREATION_HISTORY_KEY, JSON.stringify(creations))
  window.dispatchEvent(new Event(CREATION_HISTORY_EVENT))
}

export const getCreationHistory = () => {
  const storedCreations = readStoredCreations()
  return storedCreations ?? []
}

export const addCreationHistory = ({ userId, type, prompt, content = '', publish = false, likes = [] }) => {
  const nextEntry = {
    id: Date.now(),
    user_id: userId || 'local-user',
    prompt,
    content,
    type,
    publish,
    likes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const currentCreations = readStoredCreations()
  const nextCreations = [nextEntry, ...(currentCreations ?? [])]
  writeCreations(nextCreations)

  return nextEntry
}

export const removeCreationHistory = (creationId) => {
  const currentCreations = getCreationHistory()
  const nextCreations = currentCreations.filter((creation) => creation.id !== creationId)
  writeCreations(nextCreations)
  return nextCreations
}

export const onCreationsUpdated = (callback) => {
  if (!isBrowser) return () => {}

  const handleChange = () => callback(getCreationHistory())
  window.addEventListener(CREATION_HISTORY_EVENT, handleChange)
  window.addEventListener('storage', handleChange)

  return () => {
    window.removeEventListener(CREATION_HISTORY_EVENT, handleChange)
    window.removeEventListener('storage', handleChange)
  }
}
