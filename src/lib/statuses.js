import Data from '../constants/countries.json'
import moment from 'moment';

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

export const getStatus = (
  solution,
  guess
) => {
  const charObj = {
    name: '',
    nationality: '',
    team: '',
    age: '',
    lans: '',
  }

    const guessRegObj = Data.find((el) => el.name === guess.nationality)
    const answerRegObj = Data.find((el) => el.name === solution.nationality)

      if (guess.name === solution.name) {
        charObj.name = 'correct'
      } else if(guess.name !== solution.name) {
        charObj.name = 'incorrect'
      }
      
      if(guess.team === solution.team) { 
        charObj.team = 'correct'
      } else if(guess.team !== solution.team){
        charObj.team = 'incorrect'
      }

      if (calculateAge(guess.DOB) === calculateAge(solution.DOB)) {
        charObj.age = 'correct'
      } else if (diff(calculateAge(guess.DOB), calculateAge(solution.DOB)) <= 2) {
        charObj.age = 'close'
      } else if (diff(calculateAge(guess.DOB), calculateAge(solution.DOB)) > 2) {
        charObj.age = 'incorrect'
      }

      if (guess.rlcsLanAppearances === solution.rlcsLanAppearances) {
        charObj.lans = 'correct'
      } else if (diff((guess.rlcsLanAppearances), (solution.rlcsLanAppearances)) <= 2) {
        charObj.lans = 'close'
      } else if (guess.rlcsLanAppearances !== solution.rlcsLanAppearances) {
        charObj.lans = 'incorrect'
      }

      if (guess.nationality === solution.nationality) {
        charObj.nationality = 'correct'
      } else if (guessRegObj?.continent === answerRegObj?.continent) {
        charObj.nationality = 'close'
      } else if (guessRegObj?.continent !== answerRegObj?.continent) {
        charObj.nationality = 'incorrect'
      }

  return charObj
}