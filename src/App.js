import { useState, useEffect, useRef, useCallback} from 'react'
import { collection, getCountFromServer, addDoc, query, where } from "firebase/firestore";
import { db } from './firebase';
import ReactGA from "react-ga4";
import './App.css';
import debounce from 'lodash.debounce';
import Cookies from 'js-cookie';
import Div100vh from 'react-div-100vh'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Twitter from './images/iconmonstr-twitter-1-240.png'

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
import GameStatsModal from './components/Modals/GameStatsModal';
import InfoModal from './components/Modals/InfoModal';
import SettingsModal from './components/Modals/SettingsModal';

import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  saveInfoModalStatusToLocalStorage,
  loadInfoModalStatusFromLocalStorage,
  getStoredIsHighContrastMode, 
  setStoredIsHighContrastMode,
  setStoredGoogleAnalyticsConsent,
  getStoredGoogleAnalyticsConsent
} from './lib/localStorage'

import { addStatsForCompletedGame, loadStats } from './lib/stats'

import {
  getIsLatestGame,
  isWinningPlayer,
  solution,
  solutionIndex,
} from './lib/words'

import { MAX_CHALLENGES } from './constants/settings';
import CookieConsentModal from './components/Modals/CookieConsentModal';
import PrivacyModal from './components/Modals/PrivacyModal';

function App() {
  const isLatestGame = getIsLatestGame()
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGameStatsModal, setShowGameStatsModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [stats, setStats] = useState(() => loadStats())
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [publicStats, setPublicStats] = useState()

  const handleAcceptCookies = useCallback(() => {
    ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);
    ReactGA.set({ anonymizeIp: "true" })
    ReactGA.send({ hitType: "pageview", page: "/"});
    setStoredGoogleAnalyticsConsent(true);
    closeCookieModal();
  }, []);

  const handleDeclineCookies = useCallback(() => {
    setStoredGoogleAnalyticsConsent(false);
    Cookies.remove("_ga");
    Cookies.remove("_gat");
    Cookies.remove("_gid");
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    closeCookieModal();
  }, []);

  useEffect(() => {
    const isConsent = getStoredGoogleAnalyticsConsent();
    if (isConsent === true) {
      handleAcceptCookies();
      return;
    } if (isConsent === false) {
      handleDeclineCookies();
      return;
    } if (isConsent === null) {
      setShowCookieModal(true);
      return;
    }
  }, [handleAcceptCookies, handleDeclineCookies]);

  const saveGame = async (won) => {
    try {
      const docRef = addDoc(collection(db, "games"), {
        gameID: solutionIndex,  
        gameStatus: won,
        guessNum: guesses.length,
      })
      console.log("Document written with ID: ", docRef.id);
    } catch {
      console.error("Error adding document");
    }
  }

  useEffect(() => {
    sessionStorage.removeItem('dataFetched');
  }, []);

  function formatCount(value) {
    if (value < 1000) {
      return value;
    } else if (value < 1000000) {
      return (value / 1000).toFixed(1) + "K";
    } else {
      return (value / 1000000).toFixed(1) + "M";
    }
  }
  
  const retrieveWins = async () => {
    const dataFetched = sessionStorage.getItem('dataFetched');
    if (dataFetched || !gameFinished || !showGameStatsModal ) {
      return;
    }

    const dbRef = collection(db, 'games');

    const totalPlayedQuery = query(
      dbRef,
      where('gameID', '==', solutionIndex)
    );
    const totalPlayedSnapshot = await getCountFromServer(totalPlayedQuery);
    const gamesCount = totalPlayedSnapshot.data().count;

    const totalWonQuery = query(
      dbRef,
      where('gameID', '==', solutionIndex),
      where('gameStatus', '==', true)
    );
    const totalWonSnapshot = await getCountFromServer(totalWonQuery);
    const winCount = totalWonSnapshot.data().count;

    const winPercent = Math.round((winCount / gamesCount) * 100);

    const total1GuessQuery = query(
      dbRef,
      where('gameID', '==', solutionIndex),
      where('gameStatus', '==', true),
      where('guessNum', '==', 1)
    );

    const total1GuessSnapshot = await getCountFromServer(total1GuessQuery);
    const win1GuessCount = total1GuessSnapshot.data().count;

    const total2GuessQuery = query(
      dbRef,
      where('gameID', '==', solutionIndex),
      where('gameStatus', '==', true),
      where('guessNum', '==', 2)
    );

    const total2GuessSnapshot = await getCountFromServer(total2GuessQuery);
    const win2GuessCount = total2GuessSnapshot.data().count;

    const total3GuessQuery = query(
      dbRef,
      where('gameID', '==', solutionIndex),
      where('gameStatus', '==', true),
      where('guessNum', '==', 3)
    );

    const total3GuessSnapshot = await getCountFromServer(total3GuessQuery);
    const win3GuessCount = total3GuessSnapshot.data().count;

    const total4GuessQuery = query(
      dbRef,
      where('gameID', '==', solutionIndex),
      where('gameStatus', '==', true),
      where('guessNum', '==', 4)
    );

    const total4GuessSnapshot = await getCountFromServer(total4GuessQuery);
    const win4GuessCount = total4GuessSnapshot.data().count;

    const total5GuessQuery = query(
      dbRef,
      where('gameID', '==', solutionIndex),
      where('gameStatus', '==', true),
      where('guessNum', '==', 5)
    );

    const total5GuessSnapshot = await getCountFromServer(total5GuessQuery);
    const win5GuessCount = total5GuessSnapshot.data().count;

    const total6GuessQuery = query(
      dbRef,
      where('gameID', '==', solutionIndex),
      where('gameStatus', '==', true),
      where('guessNum', '==', 6)
    );

    const total6GuessSnapshot = await getCountFromServer(total6GuessQuery);
    const win6GuessCount = total6GuessSnapshot.data().count;

    const averageGuessPerWin = parseFloat(
      ((win1GuessCount + win2GuessCount * 2 + win3GuessCount * 3 + win4GuessCount * 4 + win5GuessCount * 5 + win6GuessCount * 6) / winCount).toFixed(1)
    );

    const gamesCountFormatted = formatCount(gamesCount);
    const winCountFormatted = formatCount(winCount);
    
    const newData = { gamesCount: gamesCountFormatted, winCount: winCountFormatted, winPercent, win1GuessCount, win2GuessCount, win3GuessCount, win4GuessCount, win5GuessCount, win6GuessCount, averageGuessPerWin };
    setPublicStats(newData);
  
    sessionStorage.setItem('dataFetched', 'true');
    console.log(newData)
  };
  
  const debouncedFetch = debounce(retrieveWins, 2500);

  useEffect(() => {
      debouncedFetch();

      return () => {
        debouncedFetch.cancel();
      };
  }, [debouncedFetch]);

  const firstDivRef = useRef();
  const secondDivRef = useRef();
  const [firstDivWidth, setFirstDivWidth] = useState(0);

  useEffect(() => {
    const firstDivElement = firstDivRef.current;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
      
        setFirstDivWidth(width);

      }
    });

    if (firstDivElement) {
      resizeObserver.observe(firstDivElement);
    }

    return () => {
      if (firstDivElement) {
        resizeObserver.unobserve(firstDivElement);
      }
    };
  }, []);

  const gameAlreadyWon = () => { 
    setShowSuccessModal(true);
    setGameFinished(true);
    setGameWon(true);
  }

  const gameAlreadyLost = () => {
    setShowFailModal(true);
    setGameFinished(true);
    setGameWon(false);
  }

  const gameWon = () => {
    setShowSuccessModal(true);
    setGameFinished(true);
    setGameWon(true);
    setStats(addStatsForCompletedGame(stats, guesses.length, true));
    saveGame(true);
  }

  const gameLost = () => {
    setShowFailModal(true);
    setGameFinished(true);
    setGameWon(false);
    setStats(addStatsForCompletedGame(stats, guesses.length + 1, false));
    saveGame(false);
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
    saveGameStateToLocalStorage(guesses, solution.id);
  }, [guesses]);

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
    
    saveGameStateToLocalStorage(guesses, solution.id);
    
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
      return;
    }
    if (currentGuess === 5 && !isWinningPlayer(player)) {
      gameLost();
      return;
    }
    setCurrentGuess(currentGuess + 1);
  }

  const handleHighContrastMode = (isHighContrast) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const handleHowtoPlayModal = () => {
    setShowHowtoPlayModal(true);
  }

  const handleStatsModal = () => {
    setShowStatsModal(true);
  }

  const handleSettingsModal = () => {
    setShowSettingsModal(true);
  }

  const handleGameStatsModal = () => {
    setShowGameStatsModal(true);
  }

  const handlePolicyModal = () => {
    setShowPolicyModal(true);
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

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  }

  const closeGameStatsModal = () => {
    setShowGameStatsModal(false);
  }

  const closeCookieModal = () => {
    setShowCookieModal(false);
  }

  const closePolicyModal = () => {
    setShowPolicyModal(false);
  }

  var inputBorderColour = gameFinished ? 'border-gray-500' : 'border-indigo-500';
  var isGrey = gameFinished ? 'text-gray-500' : 'text-indigo-500';
 
  return (
    <>
      <Div100vh>
        <div className="flex h-full flex-col items-center justify-center bg-[#0c101f]">
          {showSettingsModal && (
          <SettingsModal isHighContrastMode={isHighContrastMode} handleHighContrastMode={handleHighContrastMode} closeModal={closeSettingsModal}/>
          )}
          {showFailModal && (
          <FailModal closeModal={closeFailModal} answer={solution} guesses={guesses} isGameLost={!isGameWon} isHighContrastMode={isHighContrastMode} isCookieModalOpen={showCookieModal}/>
          )}
          {showSuccessModal && (
          <SuccessModal  closeModal={closeSuccessModal} answer={solution} guesses={guesses} isGameLost={!isGameWon} stats={stats} isHighContrastMode={isHighContrastMode} isCookieModalOpen={showCookieModal}/>
          )}
          {showStatsModal && (
          <StatsModal  closeModal={closeStatsModal} stats={stats}/>
          )}
          {showHowtoPlayModal && (
          <InfoModal closeModal={closeHowToPlayModal} isHighContrastMode={isHighContrastMode} isCookieModalOpen={showCookieModal}/>
          )}
          {showGameStatsModal && (
          <GameStatsModal id={solutionIndex} closeModal={closeGameStatsModal} stats={publicStats}/>
          )}
          {showCookieModal && (
          <CookieConsentModal handleAcceptCookies={handleAcceptCookies} handleDeclineCookies={handleDeclineCookies} handlePolicyModal={handlePolicyModal}/>
          )}
          {showPolicyModal && (
          <PrivacyModal closeModal={closePolicyModal}/>
          )}
          <a 
            className='absolute top-0 right-0 sm:mt-2 sm:mr-2 mt-1 mr-1 uppercase font-black m-0 sm:text-base text-sm tracking-wide sm:min-h-[48px] min-h-[36px] sm:py-3 sm:px-8 py-2 px-4 text-black bg-indigo-500 hover:bg-indigo-300 outline-none border-none rounded cursor-pointer flex items-center justify-center transition-colors ease-in-out duration-200'
            href='https://www.buymeacoffee.com/caluhm' target='_blank' rel='noreferrer'
          >
              Donate
          </a>
          <a 
            className='absolute top-0 left-0 sm:mt-2 sm:ml-2 mt-1 ml-1 uppercase font-black m-0 sm:text-base text-sm tracking-wide sm:min-h-[48px] min-h-[36px] sm:py-3 sm:px-5 py-2 px-2.5 text-black bg-blue-500 hover:bg-blue-300 outline-none border-none rounded cursor-pointer flex items-center justify-center transition-colors ease-in-out duration-200'
            href='https://twitter.com/RL_Cal' target='_blank' rel="noreferrer"  
          >
              <img src={Twitter} height={22} width={22} alt='Twitter Logo'/> <span className='text-black sm:ml-1.5 ml-1'>@RL_Cal</span>
          </a>
          <div className='flex flex-col justify-between max-w-[37.5rem] p-3'>
            <HeroSection />
            <div className='flex justify-center items-center w-full relative'>
            {!gameFinished ? (
              <div className={`relative w-full h-[50px] border-2 ${inputBorderColour} rounded-md flex items-center justify-center`} ref={firstDivRef}>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MagnifyingGlassIcon className={`h-[26px] w-[26px] ${isGrey}`} aria-hidden='true'/>
                </div>
                <input className='block w-full h-full bg-transparent text-white p-2 pl-[3.25rem] focus:outline-none' type="search" autoComplete='off' autoFocus id='search-autocomplete' name='search-input' aria-autocomplete='list' autoCapitalize='none' spellCheck='false' placeholder='Enter a player name...' list='search-autocomplete' onChange={inputHandler}/>
              </div>
            ) : (
              <div className='flex flex-row items-center justify-center text-white text-center mb-2'>
                <button 
                  className='uppercase font-black m-0 sm:text-xl text-base tracking-wide sm:min-h-[48px] min-h-[38px] sm:py-3 py-2 sm:px-8 px-4 text-black bg-indigo-500 hover:bg-indigo-300 outline-none border-none rounded cursor-pointer flex items-center justify-center transition-colors'
                  onClick={handleGameStatsModal}
                >
                  Global Stats for RLE Guessr #{solutionIndex}  
                </button>
              </div>
            )}
            {!isInputEmpty && (
              <div className={`flex-1 p-2 max-h-[250px] text-white text-md text-center bg-[#28335a] rounded-md overflow-y-scroll absolute top-[100%] z-10 drop-shadow-lg`} id='scroll-list' ref={secondDivRef} style={{ width: firstDivWidth + 4 }}>
                <List input={inputText} handleClick={handleClick} guess0={guess0} guess1={guess1} guess2={guess2} guess3={guess3} guess4={guess4} guess5={guess5}/>
              </div>
            )}
            </div>
            {gameActive && (
            <GuessGrid guess0={guess0} guess1={guess1} guess2={guess2} guess3={guess3} guess4={guess4} guess5={guess5} answer={solution} isHighContrastMode={isHighContrastMode}/>
            )}
            {gameFinished && (
              <AnswerSection answer={solution} isGameWon={isGameWon} reOpenGameEndModal={reopenModal}/>
            )}
            {gameActive && !gameFinished &&(
              <GuessCounter guess0={guess0} guess1={guess1} guess2={guess2} guess3={guess3} guess4={guess4} guess5={guess5}/>
            )}
            <Footer setIsInfoModalOpen={handleHowtoPlayModal} setIsStatsModalOpen={handleStatsModal} setIsSettingsModalOpen={handleSettingsModal}/>
          </div>
        </div>
      </Div100vh>
    </>
  )
}

export default App;