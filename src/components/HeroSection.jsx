import React from 'react'

import { HERO_SECTION_TEXT} from '../constants/strings'

const HeroSection = () => {
  return (
    <div className='flex flex-col gap-5 sm:px-11 px-4 sm:pb-10 pb-6'>
        <div className='uppercase text-white font-bold sm:text-[5.5rem] text-[3rem] leading-[0.875] italic text-center'>
          <div className='sm:block hidden font-semibold text-base bg-[#6366F1] hover:bg-yellow-500 transition-colors duration-500 ease-in-out w-min px-1.5 rounded not-italic mb-1 drop-shadow-md tracking-wide ml-auto text-center'>BETA</div>
          <div className='text-transparent font-outline-2 hover:text-white hover:font-outline-0 transition duration-500 ease-in-out'>RLEsports</div>
          <div>Guessr</div></div>
        <div className='uppercase text-white text-center font-black sm:text-2xl text-sm italic'>{HERO_SECTION_TEXT} <span className='not-italic pl-2'>⚽🏎️</span></div>
    </div>
  )
}

export default HeroSection