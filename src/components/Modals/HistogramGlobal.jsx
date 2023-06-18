import React from 'react'
import Progress from './Progress'

const isCurrentDayStatRow = (
  isLatestGame,
  isGameWon,
  numberOfGuessesMade,
  i
) => {
  return isLatestGame && isGameWon && numberOfGuessesMade === i + 1
}

const Histogram = ({
  gameStats,
  isLatestGame,
  isGameWon,
  numberOfGuessesMade,
}) => {
  const maxValue = (gameStats.length === 0) ? 0 : Math.max(...gameStats, 1)
  
  return (
    <div className="justify-left m-2 columns-1 text-sm">
        <div>
          {gameStats.map((value, i) => (
            <Progress
              key={i}
              index={i}
              isCurrentDayStatRow={isCurrentDayStatRow(
                isLatestGame,
                isGameWon,
                numberOfGuessesMade,
                i
              )}
              size={90 * (value / maxValue)}
              label={String(value)}
            />
          ))}
        </div>
    </div>
  );
};

export default Histogram
