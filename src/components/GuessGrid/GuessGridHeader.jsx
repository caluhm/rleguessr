import React from 'react'

import {
    GUESS_GRID_HEADER_NAME_TEXT,
    GUESS_GRID_HEADER_NATIONALITY_TEXT,
    GUESS_GRID_HEADER_TEAM_TEXT,
    GUESS_GRID_HEADER_AGE_TEXT,
    GUESS_GRID_HEADER_LANS_TEXT
} from '../../constants/strings'

const GuessGridHeader = () => {
  return (
    <>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold text-sm items-center justify-center tracking-[0.05em] h-[36px] uppercase'>{GUESS_GRID_HEADER_NAME_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold text-sm items-center justify-center tracking-[0.05em] h-[36px] uppercase'>{GUESS_GRID_HEADER_NATIONALITY_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold text-sm items-center justify-center tracking-[0.05em] h-[36px] uppercase'>{GUESS_GRID_HEADER_TEAM_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold text-sm items-center justify-center tracking-[0.05em] h-[36px] uppercase'>{GUESS_GRID_HEADER_AGE_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold text-sm items-center justify-center tracking-[0.05em] h-[36px] uppercase'>{GUESS_GRID_HEADER_LANS_TEXT}</div>
    </>
  )
}

export default GuessGridHeader