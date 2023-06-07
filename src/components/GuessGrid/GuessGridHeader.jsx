import React from 'react'
import { Tooltip } from 'react-tooltip'

import {
    GUESS_GRID_HEADER_NAME_TEXT,
    GUESS_GRID_HEADER_NATIONALITY_TEXT,
    GUESS_GRID_HEADER_REGION_TEXT,
    GUESS_GRID_HEADER_TEAM_TEXT,
    GUESS_GRID_HEADER_AGE_TEXT,
    GUESS_GRID_HEADER_LANS_TEXT
} from '../../constants/strings'

const GuessGridHeader = () => {
  return (
    <>
        <Tooltip id="my-tooltip" style={{backgroundColor: "#6366F1", opacity: 1, maxWidth: "13rem", textAlign: "center"}}/>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold sm:text-sm text-xs text-center items-center justify-center tracking-[0.05em] h-[36px] uppercase' data-tooltip-id="my-tooltip" data-tooltip-content="The player's in-game name." data-tooltip-place="top">{GUESS_GRID_HEADER_NAME_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold sm:text-sm text-xs text-center items-center justify-center tracking-[0.05em] h-[36px] uppercase' data-tooltip-id="my-tooltip" data-tooltip-content="The player's nationality." data-tooltip-place="top">{GUESS_GRID_HEADER_NATIONALITY_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold sm:text-sm text-xs text-center items-center justify-center tracking-[0.05em] h-[36px] uppercase' data-tooltip-id="my-tooltip" data-tooltip-content="The player's current RLCS region." data-tooltip-place="top">{GUESS_GRID_HEADER_REGION_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold sm:text-sm text-xs text-center items-center justify-center tracking-[0.05em] h-[36px] uppercase' data-tooltip-id="my-tooltip" data-tooltip-content="The player's team that they play for or coach." data-tooltip-place="top">{GUESS_GRID_HEADER_TEAM_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold sm:text-sm text-xs text-center items-center justify-center tracking-[0.05em] h-[36px] uppercase' data-tooltip-id="my-tooltip" data-tooltip-content="The player's current age." data-tooltip-place="top">{GUESS_GRID_HEADER_AGE_TEXT}</div>
        <div className='flex col-span-1 row-span-1 bg-[#28335a] rounded text-white font-semibold sm:text-sm text-xs text-center items-center justify-center tracking-[0.05em] h-[36px] uppercase' data-tooltip-id="my-tooltip" data-tooltip-content="The number of RLCS LAN's the player has attended as a player." data-tooltip-place="top">{GUESS_GRID_HEADER_LANS_TEXT}</div>
    </>
  )
}

export default GuessGridHeader