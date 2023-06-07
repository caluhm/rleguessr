const gameStateKey = 'gameState'

export const saveGameStateToLocalStorage = (gameState) => {
  const key = gameStateKey
  localStorage.setItem(key, JSON.stringify(gameState))
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