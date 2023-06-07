import React from 'react'
import { Tooltip } from 'react-tooltip'
import moment from 'moment';
import Data from "../../constants/countries.json";
import Flag from 'react-world-flags'

function calculateAge(birthday) { 
  return moment().diff(moment(birthday, 'DD-MM-YYYY'), 'years');
}

function diff(num1, num2) {
  if (num1 > num2) {
    return num1 - num2
  } else {
    return num2 - num1
  }
}

const GuessRow = ({guess, answer}) => {
  var tooltipNationalityMessage = "Nationality is incorrect.";
  var tooltipTeamMessage = "";
  var tooltipAgeMessage = "Age is incorrect.";
  var tooltipRLCSMessage = "Amount of RLCS LAN's attended is incorrect.";

  let isNameCorrect = false;
  let isNationalityCorrect = false;
  let isTeamCorrect = false;
  let isAgeCorrect = false;
  let isRLCSCorrect = false;

  if (guess.name === answer.name) {
    isNameCorrect = true;
  } if (guess.nationality === answer.nationality) {
    isNationalityCorrect = true;
    tooltipNationalityMessage = "Nationality is correct.";
  } if (guess.team === answer.team) {
    isTeamCorrect = true;
    tooltipTeamMessage = "Team is correct.";
  } else if (guess.team !== answer.team) {
    tooltipTeamMessage = "Team is incorrect.";
  }
  if (calculateAge(guess.DOB) === calculateAge(answer.DOB)) {
    isAgeCorrect = true;
    tooltipAgeMessage = "Age is correct.";
  } if (guess.rlcsLanAppearances === answer.rlcsLanAppearances) {
    isRLCSCorrect = true;
    tooltipRLCSMessage = "Amount of RLCS LAN's attended is correct.";
  }

  const nameColour = isNameCorrect ? 'bg-[#147549]' : 'bg-[#151c36]';
  let nationalityColour = isNationalityCorrect ? 'bg-[#147549]' : 'bg-[#151c36]';
  const teamColour = isTeamCorrect ? 'bg-[#147549]' : 'bg-[#151c36]';
  let ageColour = isAgeCorrect ? 'bg-[#147549]' : 'bg-[#151c36]';
  let rlcsColour = isRLCSCorrect ? 'bg-[#147549]' : 'bg-[#151c36]';

  const guessRegObj = Data.find((el) => el.name === guess.nationality)
  const answerRegObj = Data.find((el) => el.name === answer.nationality)
  const correctRLCS = answer.rlcsLanAppearances;
  const guessRLCS = guess.rlcsLanAppearances;
  const correctAge = calculateAge(answer.DOB);
  const guessAge = calculateAge(guess.DOB);
  
  if (diff(calculateAge(guess.DOB), calculateAge(answer.DOB)) <= 2 && !isAgeCorrect) {
      ageColour = 'bg-[#9d5c3b]';
      tooltipAgeMessage = "Close, but the player is"
      if (correctAge > guessAge) {
        tooltipAgeMessage += " older."
      } else if (correctAge < guessAge) {
        tooltipAgeMessage += " younger."
      } 
  } if (diff((guess.rlcsLanAppearances), (answer.rlcsLanAppearances)) <= 2 && !isRLCSCorrect) {
      rlcsColour = 'bg-[#9d5c3b]';
      tooltipRLCSMessage = "Close, the amount of RLCS LAN's attended is"
      if (correctRLCS > guessRLCS) {
        tooltipRLCSMessage += " more.";
      } else if (correctRLCS < guessRLCS) {
        tooltipRLCSMessage += " less.";
      } 
  }

  if (guessRegObj?.continent === answerRegObj?.continent && !isNationalityCorrect) {
    nationalityColour = 'bg-[#9d5c3b]';
    tooltipNationalityMessage = "Close, the player is from the same continent."
  }

  function returnArrowAge() {
    if (correctAge === guessAge) {
      return '';
    } else if (correctAge > guessAge) {
      return ' ↑';
    } else if (correctAge < guessAge) {
      return ' ↓';
    } 
  }

  function returnArrowRLCS() {
    if (correctRLCS === guessRLCS) {
      return '';
    } else if (correctRLCS > guessRLCS) {
      tooltipRLCSMessage += " more.";
      return ' ↑';
    } else if (correctRLCS < guessRLCS) {
      tooltipRLCSMessage += " less.";
      return ' ↓';
    } 
  }
  
  return (
    <>
        <Tooltip id="my-tooltip" style={{backgroundColor: "#6366F1", opacity: 1, maxWidth: "13rem", textAlign: "center"}}/>
        <div className={`flex col-span-1 row-span-1 ${nameColour} rounded text-white font-md sm:text-sm text-xs text-center items-center justify-center h-[36px]`}>{guess.name}</div>
        <div className={`flex col-span-1 row-span-1 ${nationalityColour} rounded text-white font-md sm:text-sm text-xs text-center items-center justify-center h-[36px] overflow-hidden`} data-tooltip-id="my-tooltip" data-tooltip-content={tooltipNationalityMessage} data-tooltip-place="top">
          <Flag code={guessRegObj.code} width={36} className='border border-white' title={'Flag of ' + guess.nationality}/>
        </div>
        <div className={`flex col-span-1 row-span-1 ${teamColour} rounded text-white font-md sm:text-sm text-xs text-center items-center justify-center h-[36px]`} data-tooltip-id="my-tooltip" data-tooltip-content={tooltipTeamMessage} data-tooltip-place="top">{guess.team}</div>
        <div className={`flex col-span-1 row-span-1 ${ageColour} rounded text-white font-md sm:text-sm text-xs text-center items-center justify-center h-[36px]`} data-tooltip-id="my-tooltip" data-tooltip-content={tooltipAgeMessage} data-tooltip-place="top">
          <div className='flex items-center justify-center'>
            <div>{calculateAge(guess.DOB)}</div>
            {isAgeCorrect ? (null) : (
            <div className='mt-[-3px] ml-1'>{returnArrowAge()}</div>)}
          </div>
        </div>
        <div className={`flex col-span-1 row-span-1 ${rlcsColour} rounded text-white font-md sm:text-sm text-xs text-center items-center justify-center h-[36px]`} data-tooltip-id="my-tooltip" data-tooltip-content={tooltipRLCSMessage} data-tooltip-place="top">
          <div className='flex items-center justify-center'>
            <div>{guess.rlcsLanAppearances}</div>
            {isRLCSCorrect ? (null) : (
            <div className='mt-[-3px] ml-1'>{returnArrowRLCS()}</div>)}
          </div>
        </div>
    </>
  )
}

export default GuessRow;