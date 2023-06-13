const gameStateKey = 'gameState'

export const saveGameStateToLocalStorage = (guesses, solutionId) => {
  const key = gameStateKey;
  const gameState = { guesses, solution: { id: solutionId } };
  localStorage.setItem(key, JSON.stringify(gameState));
}

export const loadGameStateFromLocalStorage = () => {
  const key = gameStateKey
  const state = localStorage.getItem(key)
  return state ? (JSON.parse(state)) : null
}

const gameStatKey = 'gameStats'

export const saveStatsToLocalStorage = (gameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats)) : null
}

const infoModalKey = 'newInfoModalShown'

export const saveInfoModalStatusToLocalStorage = () => {
    localStorage.setItem(infoModalKey, true)
}

export const loadInfoModalStatusFromLocalStorage = () => {
    const infoModalShown = localStorage.getItem(infoModalKey)
    return infoModalShown ? (infoModalShown) : false
}

const highContrastKey = 'highContrast'

export const setStoredIsHighContrastMode = (isHighContrast) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}

const googleAnalyticsKey = 'gaConsent'

export const setStoredGoogleAnalyticsConsent = (consent) => {
  if (consent) {
    localStorage.setItem(googleAnalyticsKey, true)
  } else {
    localStorage.setItem(googleAnalyticsKey, false)
  }
}

export const getStoredGoogleAnalyticsConsent = () => {
  const consent = localStorage.getItem(googleAnalyticsKey);
  return consent ? consent === "true" : null;
}
