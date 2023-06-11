import { UAParser } from 'ua-parser-js'

import { MAX_CHALLENGES } from '../constants/settings'
import { GAME_TITLE } from '../constants/strings'
import { getStatus } from './statuses'
import { solutionIndex } from './words'

const webShareApiDeviceTypes = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

export const shareStatus = (
    solution,
    guesses,
    lost,
    isHighContrastMode,
    handleShareToClipboard,
    handleShareFailure
  ) => {
    const textToShare =
      `${GAME_TITLE} #${solutionIndex} - ${
        lost ? 'X' : guesses.length
      }/${MAX_CHALLENGES}\n\n` +
      generateEmojiGrid(
        solution,
        guesses,
        getEmojiTiles(isHighContrastMode)
      )
      // eslint-disable-next-line no-useless-concat
      + '\n\n' + 'https://rleguessr.app/'
    const shareData = { text: textToShare }
  
    let shareSuccess = false
  
    try {
      if (attemptShare(shareData)) {
        navigator.share(shareData)
        shareSuccess = true
      }
    } catch (error) {
      shareSuccess = false
    }
  
    try {
      if (!shareSuccess) {
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(textToShare)
            .then(handleShareToClipboard)
            .catch(handleShareFailure)
        } else {
          handleShareFailure()
        }
      }
    } catch (error) {
      handleShareFailure()
    }
  }

  export const generateEmojiGrid = (
    solution,
    guesses,
    tiles
  ) => {
    return guesses
      .map((guess) => {
        const status = getStatus(solution, guess);
  
        return Object.keys(status)
          .map((key, index) => {
            switch (status[key]) {
              case 'correct':               
                return tiles[0];
              case 'close':
                return tiles[1];
              default:              
                return tiles[2];
            }
          })
          .join('');
      })
      .join('\n');
  };
  
  const attemptShare = (shareData) => {
    return (
      // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
      browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
      webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
      navigator.canShare &&
      navigator.canShare(shareData) &&
      navigator.share
    )
  }

const getEmojiTiles = (isHighContrastMode) => {
    let tiles = []
    tiles.push(isHighContrastMode ? '🟧' : '🟩')
    tiles.push(isHighContrastMode ? '🟦' : '🟧')
    tiles.push('⬛')
    return tiles
  }