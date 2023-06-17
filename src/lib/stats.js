import { MAX_CHALLENGES } from '../constants/settings'

import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

// In stats array elements 0-5 are successes in 1-6 trys

export const addStatsForCompletedGame = (
  gameStats,
  count,
  won
) => {
  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }

  stats.totalGames += 1

  if (!won) {
    // A fail situation
    stats.currentStreak = 0
    stats.gamesFailed += 1
  } else {
    // A win situation
    stats.winDistribution[count-1] += 1
    stats.currentStreak += 1

    if (stats.bestStreak < stats.currentStreak) {
      stats.bestStreak = stats.currentStreak
    }
  }

  stats.successRate = getSuccessRate(stats)

  saveStatsToLocalStorage(stats)
  return stats
}

const defaultStats = {
  winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
}

export const loadStats = () => {
  const stats = loadStatsFromLocalStorage();
  if (!stats) {
    return defaultStats;
  } else if (stats.winDistribution) {
    return stats;
  } else {
    stats.winDistribution = defaultStats.winDistribution;
    return stats;
  }
};

const getSuccessRate = (gameStats) => {
  const { totalGames, gamesFailed } = gameStats

  return Math.round(
    (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
  )
}