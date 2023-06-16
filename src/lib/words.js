import {
    addDays,
    differenceInDays,
    formatISO,
    parseISO,
    startOfDay,
  } from 'date-fns'

  import queryString from 'query-string'
  
  import { getToday } from './dateutils'
  import Players from '../constants/players2.json'
 
  
  // 1 January 2022 Game Epoch
  export const firstGameDate = new Date(2023, 5, 5)
  export const periodInDays = 1
  
  export const isWinningPlayer = (player) => {
    return solution.id === player.id
  }
  
  export const getLastGameDate = (today) => {
    const t = startOfDay(today)
    let daysSinceLastGame = differenceInDays(firstGameDate, t) % periodInDays
    return addDays(t, -daysSinceLastGame)
  }
  
  export const getNextGameDate = (today) => {
    return addDays(getLastGameDate(today), periodInDays)
  }
  
  export const isValidGameDate = (date) => {
    if (date < firstGameDate || date > getToday()) {
      return false
    }
  
    return differenceInDays(firstGameDate, date) % periodInDays === 0
  }
  
  export const getIndex = (gameDate) => {
    let start = firstGameDate
    let index = -1
    do {
      index++
      start = addDays(start, periodInDays)
    } while (start <= gameDate)
  
    return index
  }
  
  export const getPlayerOfDay = (index) => {
    if (index < 0) {
      throw new Error('Invalid index')
    }
  
    return Players[index % Players.length]
  }
  
  export const getSolution = (gameDate) => {
    const nextGameDate = getNextGameDate(gameDate)
    const index = getIndex(gameDate)
    const wordOfTheDay = getPlayerOfDay(index)
    return {
      solution: wordOfTheDay,
      solutionGameDate: gameDate,
      solutionIndex: index,
      tomorrow: nextGameDate.valueOf(),
    }
  }
  
  export const getGameDate = () => {
    if (getIsLatestGame()) {
      return getToday()
    }
  
    const parsed = queryString.parse(window.location.search)
    try {
      const d = startOfDay(parseISO(parsed.d.toString()))
      if (d >= getToday() || d < firstGameDate) {
        setGameDate(getToday())
      }
      return d
    } catch (e) {
      console.log(e)
      return getToday()
    }
  }
  
  export const setGameDate = (d) => {
    try {
      if (d < getToday()) {
        window.location.href = '/?d=' + formatISO(d, { representation: 'date' })
        return
      }
    } catch (e) {
      console.log(e)
    }
    window.location.href = '/'
  }
  
  export const getIsLatestGame = () => {
    const parsed = queryString.parse(window.location.search)
    return parsed === null || !('d' in parsed)
  }
  
  export const { solution, solutionGameDate, solutionIndex, tomorrow } =
    getSolution(getGameDate())

  export const setLiquipediaLink = (player) => {
    const parsedName = (player.name).replace(' ', '_').replace('.', '');
    const link = 'https://liquipedia.net/rocketleague/' + parsedName;

    return link;
  }