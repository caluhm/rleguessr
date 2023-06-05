import React from 'react'
import Flag from 'react-world-flags'
import { ANSWER_SECTION_IMAGE_ALT_TEXT } from '../constants/strings'
import Data from "../constants/countries.json";
import Profile from '../images/PlayerProfile.svg'

const AnswerSection = ({
    answer, 
    isGameWon, 
    reOpenGameEndModal
}) => {

    const answerRegObj = Data.find((el) => el.name === answer?.nationality)
    const answerDivCol = isGameWon ? 'border-green-500' : 'border-red-500';

  return (
    <div className={`flex w-full h-[6.25rem] overflow-hidden bg-[#28335a] text-white cursor-pointer rounded-md border-2 ${answerDivCol}`} onClick={reOpenGameEndModal}>
        <div className='flex flex-col items-center justify-center min-w-[6.25rem] w-[6.25rem] h-[6.25rem] bg-indigo-500 mr-6'>
            <img src={Profile} width={90} height={90} alt={ANSWER_SECTION_IMAGE_ALT_TEXT} className='invert'/>
        </div>
        <div className='flex flex-col justify-center items-start w-full gap-1'>
            <p className='uppercase font-black tracking-normal text-3xl p-0 m-0'>{answer?.name}</p>
            <div className='flex flex-row items-center'>
                <Flag code={answerRegObj.code} width={30} className='border border-white mr-2.5' title={'Flag of ' + answer.nationality}/>
                <p className='tracking-normal text-sm font-medium text-white p-0 m-0'>{answer?.fullName}</p>
            </div>
        </div>
    </div>
  )
}

export default AnswerSection