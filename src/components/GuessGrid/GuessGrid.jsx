import React from 'react'

import GuessGridHeader from "./GuessGridHeader"
import GuessGridRow from "./GuessGridRow"

const GuessGrid = ({
    guess0,
    guess1,
    guess2,
    guess3,
    guess4, 
    guess5,
    answer,
    isHighContrastMode
}) => {
  return (
    <div className='grid gap-[2px] grid-cols-[1.75fr_1fr_1fr_2fr_1fr_1.25fr] w-full sm:my-8 my-5'>
        <GuessGridHeader />
        {guess0?.length !== 0 && (
            <GuessGridRow guess={guess0} answer={answer} isHighContrastMode={isHighContrastMode}/>
        )}
        {guess1?.length !==  0 && (
            <GuessGridRow guess={guess1} answer={answer} isHighContrastMode={isHighContrastMode}/>
        )}
        {guess2?.length !==  0 && (
            <GuessGridRow guess={guess2} answer={answer} isHighContrastMode={isHighContrastMode}/>
        )}
        {guess3?.length !==  0 && (
            <GuessGridRow guess={guess3} answer={answer} isHighContrastMode={isHighContrastMode}/>
        )}
        {guess4?.length !==  0 && (
            <GuessGridRow guess={guess4} answer={answer} isHighContrastMode={isHighContrastMode}/>
        )}
        {guess5?.length !==  0 && (
            <GuessGridRow guess={guess5} answer={answer} isHighContrastMode={isHighContrastMode}/>
        )}
    </div>
  )
}

export default GuessGrid