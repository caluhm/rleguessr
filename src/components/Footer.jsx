import React from 'react'

import {
    ChartBarSquareIcon,
    InformationCircleIcon,
  } from '@heroicons/react/24/outline'

import { FOOTER_HELP_TEXT, FOOTER_STATS_TEXT } from '../constants/strings'

const Footer = ({
    setIsInfoModalOpen, 
    setIsStatsModalOpen,
}) => {
  return (
    <div className='flex w-full flex-row items-center justify-center gap-8 pt-3 text-white'>
        <button 
            className='uppercase bg-transparent font-semibold text-xs border-none cursor-pointer py-4 px-4 tracking-[0.1375em] hover:text-gray-400 transition-colors' 
            onClick={() => setIsInfoModalOpen(true)}
        >
            <div className='flex flex-row items-center justify-center gap-2'>
                <InformationCircleIcon
                    className="h-6 w-6"
                />
                {FOOTER_HELP_TEXT}
            </div>
        </button>
            
        <button 
            className='uppercase bg-transparent font-semibold text-xs border-none cursor-pointer py-4 px-4 tracking-[0.1375em] hover:text-gray-400 transition-colors' 
            onClick={() => setIsStatsModalOpen(true)}
        >
            <div className='flex flex-row items-center justify-center gap-2'>
                <ChartBarSquareIcon
                    className="h-6 w-6"
                />
                {FOOTER_STATS_TEXT}
            </div>
        </button>
    </div>
  )
}

export default Footer