import React from 'react'

import HeroImage from '../images/HeroImage.svg'
import { HERO_SECTION_TEXT, HERO_SECTION_IMAGE_ALT_TEXT } from '../constants/strings'

const HeroSection = () => {
  return (
    <div className='flex flex-col gap-2 px-10 pb-10'>
        <img src={HeroImage} width={528} height={192} alt={HERO_SECTION_IMAGE_ALT_TEXT}/>
        <div className='uppercase text-white text-center font-black text-2xl italic'>{HERO_SECTION_TEXT}</div>
    </div>
  )
}

export default HeroSection