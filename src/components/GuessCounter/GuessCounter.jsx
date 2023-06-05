import React from 'react'

import GuessBlob from "./GuessBlob"

const GuessCounter = ({
    guess0,
    guess1,
    guess2,
    guess3,
    guess4, 
    guess5,
}) => {
    
  return (
    <div className='flex w-full flex-row items-center justify-center'>
        <div className='flex w-[30%] flex-row justify-between'>
            {guess0?.length === 0 ? (
                <GuessBlob checked={false}/>
            ) : (
                <GuessBlob checked={true}/>
            )}
            {guess1?.length === 0 ? (
                <GuessBlob checked={false}/>
            ) : (
                <GuessBlob checked={true}/>
            )}
            {guess2?.length === 0 ? (
                <GuessBlob checked={false}/>
            ) : (
                <GuessBlob checked={true}/>
            )}
            {guess3?.length === 0 ? (
                <GuessBlob checked={false}/>
            ) : (
                <GuessBlob checked={true}/>
            )}
            {guess4?.length === 0 ? (
                <GuessBlob checked={false}/>
            ) : (
                <GuessBlob checked={true}/>
            )}
            {guess5?.length === 0 ? (
                <GuessBlob checked={false}/>
            ) : (
                <GuessBlob checked={true}/>
            )}
        </div>
    </div>
  )
}

export default GuessCounter