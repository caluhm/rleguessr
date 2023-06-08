import React from 'react'

import {
    ChartBarSquareIcon,
    InformationCircleIcon,
    Cog8ToothIcon
  } from '@heroicons/react/24/outline'

import { FOOTER_HELP_TEXT, FOOTER_STATS_TEXT, FOOTER_SETTINGS_TEXT } from '../constants/strings'

const Footer = ({
    setIsInfoModalOpen, 
    setIsStatsModalOpen,
    setIsSettingsModalOpen
}) => {
  return (
    <div className='flex w-full flex-row items-center justify-between gap-0 sm:justify-center sm:gap-8 sm:pt-3 pt-0 text-white'>
        <button 
            className='uppercase bg-transparent font-semibold sm:text-xs text-[0.7rem] border-none cursor-pointer py-4 px-4 tracking-[0.1375em] hover:text-gray-400 transition-colors' 
            onClick={() => setIsInfoModalOpen(true)}
        >
            <div className='flex flex-row items-center justify-center gap-2'>
                <InformationCircleIcon
                    className="sm:h-6 sm:w-6 h-5 w-5"
                />
                {FOOTER_HELP_TEXT}
            </div>
        </button>
            
        <button 
            className='uppercase bg-transparent font-semibold sm:text-xs text-[0.7rem] border-none cursor-pointer py-4 px-4 tracking-[0.1375em] hover:text-gray-400 transition-colors' 
            onClick={() => setIsStatsModalOpen(true)}
        >
            <div className='flex flex-row items-center justify-center gap-2'>
                <ChartBarSquareIcon
                    className="sm:h-6 sm:w-6 h-5 w-5"
                />
                {FOOTER_STATS_TEXT}
            </div>
        </button>
        <button 
            className='uppercase bg-transparent font-semibold sm:text-xs text-[0.7rem] border-none cursor-pointer py-4 px-4 tracking-[0.1375em] hover:text-gray-400 transition-colors' 
            onClick={() => setIsSettingsModalOpen(true)}
        >
            <div className='flex flex-row items-center justify-center gap-2'>
                <Cog8ToothIcon
                    className="sm:h-6 sm:w-6 h-5 w-5"
                />
                {FOOTER_SETTINGS_TEXT}
            </div>
        </button>
    </div>
  )
}

export default Footer