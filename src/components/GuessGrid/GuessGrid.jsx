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
}) => {
  return (
    <div className='grid gap-[2px] grid-cols-[2fr_1fr_2.5fr_1fr_1.5fr] w-full my-8'>
        <GuessGridHeader />
        {guess0?.length !== 0 && (
            <GuessGridRow guess={guess0} answer={answer}/>
        )}
        {guess1?.length !==  0 && (
            <GuessGridRow guess={guess1} answer={answer}/>
        )}
        {guess2?.length !==  0 && (
            <GuessGridRow guess={guess2} answer={answer}/>
        )}
        {guess3?.length !==  0 && (
            <GuessGridRow guess={guess3} answer={answer}/>
        )}
        {guess4?.length !==  0 && (
            <GuessGridRow guess={guess4} answer={answer}/>
        )}
        {guess5?.length !==  0 && (
            <GuessGridRow guess={guess5} answer={answer}/>
        )}
    </div>
  )
}

export default GuessGrid