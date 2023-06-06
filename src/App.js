import { useState, useEffect } from 'react'
import './App.css';

import Div100vh from 'react-div-100vh'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import Data from "./constants/players.json";
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import AnswerSection from './components/AnswerSection';
import GuessCounter from './components/GuessCounter/GuessCounter';
import GuessGrid from './components/GuessGrid/GuessGrid';
import List from './components/List';
import FailModal from './components/Modals/FailModal';
import SuccessModal from './components/Modals/SuccessModal';
import StatsModal from './components/Modals/StatsModal';
import InfoModal from './components/Modals/InfoModal';

import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  saveInfoModalStatusToLocalStorage,
  loadInfoModalStatusFromLocalStorage
} from './lib/localStorage'

import { addStatsForCompletedGame, loadStats } from './lib/stats'

import {
  getIsLatestGame,
  isWinningPlayer,
  solution,
} from './lib/words'

import { MAX_CHALLENGES } from './constants/settings';
import { inject } from '@vercel/analytics';
inject();

function App() {
  const isLatestGame = getIsLatestGame()

  // eslint-disable-next-line 
  
  const [inputText, setInputText] = useState("");
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [currentGuess, setCurrentGuess] = useState(0); 
  const [gameActive, setGameActive] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [isGameWon, setGameWon] = useState(false);
  const [guess0, setGuess0] = useState([]);
  const [guess1, setGuess1] = useState([]);
  const [guess2, setGuess2] = useState([]);
  const [guess3, setGuess3] = useState([]);
  const [guess4, setGuess4] = useState([]);
  const [guess5, setGuess5] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showHowtoPlayModal, setShowHowtoPlayModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState(() => loadStats())

  const gameAlreadyWon = () => { 
    setShowSuccessModal(true);
    setGameFinished(true);
    setGameWon(true);
    window.addEventListener('load', () => {
      document.getElementById("search-autocomplete").disabled = true;
      document.getElementById("search-autocomplete").placeholder = "";
    });
  }

  const gameAlreadyLost = () => {
    setShowFailModal(true);
    setGameFinished(true);
    setGameWon(false);
    window.addEventListener('load', () => {
      document.getElementById("search-autocomplete").disabled = true;
      document.getElementById("search-autocomplete").placeholder = "";
    });
  }

  const gameWon = () => {
    document.getElementById("search-autocomplete").disabled = true;
    document.getElementById("search-autocomplete").placeholder = "";
    setShowSuccessModal(true);
    setGameFinished(true);
    setGameWon(true);
    setStats(addStatsForCompletedGame(stats, guesses.length));
  }

  const gameLost = () => {
    document.getElementById("search-autocomplete").disabled = true;
    document.getElementById("search-autocomplete").placeholder = "";
    setShowFailModal(true);
    setGameFinished(true);
    setGameWon(false);
    setStats(addStatsForCompletedGame(stats, guesses.length + 1));
  }

  // eslint-disable-next-line no-unused-vars
  const [guesses, setGuesses] = useState(() => {
    const loaded = loadGameStateFromLocalStorage(isLatestGame)
    if (loaded?.solution.id !== solution.id) {
      return []
    }
    const gameWasWon = loaded.guesses.some(guess => guess.id === solution.id)
    if (gameWasWon) {
      gameAlreadyWon()
    } else if (loaded.guesses.length === MAX_CHALLENGES) {
      gameAlreadyLost()

    }
    if (loaded.guesses[0]) {
      setGuess0(loaded.guesses[0])
      setGameActive(true);
      setCurrentGuess(1);
    }
    if (loaded.guesses[1]) {
      setGuess1(loaded.guesses[1])
      setCurrentGuess(2);
    }
    if (loaded.guesses[2]) {
      setGuess2(loaded.guesses[2])
      setCurrentGuess(3);
    }
    if (loaded.guesses[3]) {
      setGuess3(loaded.guesses[3])
      setCurrentGuess(4);
    }
    if (loaded.guesses[4]) {
      setGuess4(loaded.guesses[4])
      setCurrentGuess(5);
    }
    if (loaded.guesses[5]) {
      setGuess5(loaded.guesses[5])
    }

    return loaded.guesses
  }); // [guess0, guess1, guess2, guess3, guess4, guess5]

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  useEffect(() => {
    const status = loadInfoModalStatusFromLocalStorage()
    if (!status) {
      setShowHowtoPlayModal(true)
      saveInfoModalStatusToLocalStorage()
    }
  }, [])

  const reopenModal = () => {
    if (isGameWon) {
      setShowSuccessModal(true);
    } else {
      setShowFailModal(true);
    }
  }

  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
    setIsInputEmpty(false);
    if (lowerCase === "") {
      setIsInputEmpty(true);
    }
  };

  const handleClick = (id) => {
    document.getElementById('search-autocomplete').value = '';
    setInputText('');
    setIsInputEmpty(true);

    var player = Data.find((el) => el.id === id);

    guesses.push(player);
    
    saveGameStateToLocalStorage({ guesses, solution })
    
    if (currentGuess === 0) {
      setGameActive(true);
      setGuess0(player);
    }
    if (currentGuess === 1) {
      setGuess1(player);
    }
    if (currentGuess === 2) {
      setGuess2(player);
    }
    if (currentGuess === 3) {
      setGuess3(player);
    }
    if (currentGuess === 4) {
      setGuess4(player);
    }
    if (currentGuess === 5) {
      setGuess5(player);
    }
    if (isWinningPlayer(player)) {
      gameWon();
    }
    if (currentGuess === 5 && !isWinningPlayer(player)) {
      gameLost();
    }
    setCurrentGuess(currentGuess + 1);
  }

  const handleHowtoPlayModal = () => {
    setShowHowtoPlayModal(true);
  }

  const handleStatsModal = () => {
    setShowStatsModal(true);
  }

  const closeHowToPlayModal = () => {
    setShowHowtoPlayModal(false);
  }

  const closeStatsModal = () => {
    setShowStatsModal(false);
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  }

  const closeFailModal = () => {
    setShowFailModal(false);
  }

  var inputBorderColour = gameFinished ? 'border-gray-500' : 'border-indigo-500';
  var isGrey = gameFinished ? 'text-gray-500' : 'text-indigo-500';
  var topAmount = 'sm:top-[597px] top-[556px]';

  if (gameActive) {
    guesses.length === 1 ? topAmount = 'sm:top-[525px] top-[484px]'
    : guesses.length === 2 ? topAmount = 'sm:top-[506px] top-[465px]'
    : guesses.length === 3 ? topAmount = 'sm:top-[487px] top-[446px]'
    : guesses.length === 4 ? topAmount = 'sm:top-[468px] top-[427px]'
    : guesses.length === 5 ? topAmount = 'sm:top-[449px] top-[408px]'
    : topAmount = 'sm:top-[597px] top-[556px]';
  }

  return (
    <>
      <Div100vh>
        <div className="flex h-full flex-col items-center justify-center bg-[#0c101f]">
          {showFailModal && (
          <FailModal closeModal={closeFailModal} answer={solution} guesses={guesses} isGameLost={!isGameWon}/>
          )}
          {showSuccessModal && (
          <SuccessModal  closeModal={closeSuccessModal} answer={solution} guesses={guesses} isGameLost={!isGameWon} stats={stats}/>
          )}
          {showStatsModal && (
          <StatsModal  closeModal={closeStatsModal} stats={stats}/>
          )}
          {showHowtoPlayModal && (
          <InfoModal closeModal={closeHowToPlayModal}/>
          )}
          <div className='flex flex-col justify-between max-w-[37.5rem] p-3'>
            <HeroSection />
            <div className='flex justify-center items-center w-full'>
              <div className={`relative w-full h-[50px] border-2 ${inputBorderColour} rounded-md flex items-center justify-center`}>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MagnifyingGlassIcon className={`h-[26px] w-[26px] ${isGrey}`} aria-hidden='true'/>
                </div>
                <input className='block w-full h-full bg-transparent text-white p-2 pl-[3.25rem] focus:outline-none' type="search" autoComplete='off' autoFocus id='search-autocomplete' name='search-input' aria-autocomplete='list' autoCapitalize='none' spellCheck='false' placeholder='Enter a player name...' list='search-autocomplete' onChange={inputHandler}/>
              </div>
            
            {!isInputEmpty && (
              <div className={`flex-1 sm:w-[36rem] w-[calc(100vw-1.5rem)] p-2 max-h-[250px] text-white text-md text-center bg-[#28335a] rounded-md overflow-y-scroll absolute z-10 ${topAmount} drop-shadow-lg`} id='scroll-list'>
                <List input={inputText} handleClick={handleClick} guess0={guess0} guess1={guess1} guess2={guess2} guess3={guess3} guess4={guess4} guess5={guess5}/>
              </div>
            )}
            </div>
            {gameActive && (
            <GuessGrid guess0={guess0} guess1={guess1} guess2={guess2} guess3={guess3} guess4={guess4} guess5={guess5} answer={solution}/>
            )}
            {gameFinished && (
              <AnswerSection answer={solution} isGameWon={isGameWon} reOpenGameEndModal={reopenModal}/>
            )}
            {gameActive && !gameFinished &&(
              <GuessCounter guess0={guess0} guess1={guess1} guess2={guess2} guess3={guess3} guess4={guess4} guess5={guess5}/>
            )}
            <Footer setIsInfoModalOpen={handleHowtoPlayModal} setIsStatsModalOpen={handleStatsModal}/>
          </div>
        </div>
      </Div100vh>
    </>
  )
}

export default App;
