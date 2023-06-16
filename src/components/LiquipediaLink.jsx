import React from 'react'
import { setLiquipediaLink } from '../lib/words'

import {
    LinkIcon
  } from '@heroicons/react/24/outline'

const LiquipediaLink = ({answer}) => {
  return (
    <a
        className='flex flex-row items-center text-xs font-light p-0 m-0 normal-case text-white gap-1 transition-colors ease-in-out duration-150 underline hover:text-indigo-300 tracking-wide'
        href={setLiquipediaLink(answer)}
        target='_blank'
        rel='noreferrer'
        > 
            <LinkIcon className='h-4 w-4'/>
            <p>Liquipedia Page</p>
    </a>
  )
}

export default LiquipediaLink