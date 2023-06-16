import React, {useEffect, useRef} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Countdown from 'react-countdown';
import Data from "../../constants/countries.json";
import Icon from '../../images/CloseIcon.png';
import Flag from 'react-world-flags'
import {
  FAIL_MODAL_TITLE_TEXT,
  FAIL_MODAL_BODY_TEXT_1,
  FAIL_MODAL_BODY_TEXT_2,
  FAIL_MODAL_BODY_TEXT_3,
  FAIL_MODAL_BUTTON_TEXT,
  FAIL_MODAL_FOOTER_TEXT,
} from "../../constants/strings";
import { shareStatus } from '../../lib/share';
import { tomorrow } from '../../lib/words'
import LiquipediaLink from '../LiquipediaLink';

const FailModal = ({answer, guesses, isGameLost, closeModal, isHighContrastMode, isCookieModalOpen}) => {
    const ref = useRef()
    const answerRegObj = Data.find((el) => el.name === answer.nationality)

    function useOnClickOutside(ref, handler) {
        useEffect(
          () => {
            if (isCookieModalOpen) return;
            const listener = (event) => {
              // Do nothing if clicking ref's element or descendent elements
              if (!ref.current || ref.current.contains(event.target)) {
                return;
              }
              handler(event);
            };
            document.addEventListener("mousedown", listener);
            document.addEventListener("touchstart", listener);
            return () => {
              document.removeEventListener("mousedown", listener);
              document.removeEventListener("touchstart", listener);
            };
          },
          // Add ref and handler to effect dependencies
          // It's worth noting that because passed in handler is a new ...
          // ... function on every render that will cause this effect ...
          // ... callback/cleanup to run every render. It's not a big deal ...
          // ... but to optimize you can wrap handler in useCallback before ...
          // ... passing it into this hook.
          [ref, handler]
        ); 
    }

    useOnClickOutside(ref, () => closeModal());

    const handleShareToClipboard = () => toast.success("Game copied to clipboard! 📋");
  return (
    <div className='fixed w-[100vw] h-full min-h-[100vh] top-0 left-0 z-[500] bg-white/10 backdrop-blur-sm flex flex-col justify-start items-center p-4'>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
        closeButton={false}
      />
        <div className='relative m-auto overflow-hidden sm:p-10 p-5 bg-[#0c101f] w-full max-w-[31.25rem] max-h-[calc(100vh-2.5rem)] outline-none flex flex-col rounded-md drop-shadow-lg' ref={ref}>
            <button className='flex items-center justify-center cursor-pointer absolute top-4 right-4 hover:opacity-70 transition-opacity' onClick={closeModal}><img src={Icon} height={24} width={24} alt='Exit Modal' className='invert'/></button>
            <div className='z-1 mt-6'>
                <div className='relative flex flex-col items-center h-fit'>
                    <h1 className='sm:text-3xl text-2xl font-bold bg-clip-text text-white'>{FAIL_MODAL_TITLE_TEXT}</h1>
                </div>
                <div className='h-[0.0625rem] w-full bg-white/20 sm:my-8 my-4 mx-auto'></div>
                <div className='text-center text-white uppercase font-bold sm:mt-8 mt-4 tracking-[0.04em] text-sm'>{FAIL_MODAL_BODY_TEXT_1}</div>
                <div className='text-center text-white uppercase font-bold mt-4 tracking-[0.04em] text-sm'>{FAIL_MODAL_BODY_TEXT_2}</div>
                <div className='flex w-full h-[6.25rem] max-w-[37.5rem] overflow-hidden bg-[#28335a] my-[1.5rem] mx-auto text-white rounded-md'>
                    <div className='flex flex-col justify-between items-center w-full border-2 border-red-500 pt-1.5 pb-2'>
                        <p className='uppercase font-black tracking-normal sm:text-3xl text-2xl p-0 m-0'>{answer.name}</p>
                        <div className='flex flex-row items-center pb-0.5 m-0'>
                            <Flag code={answerRegObj.code} width={30} className='border border-white mr-2.5' title={'Flag of ' + answer.nationality}/>
                            <p className='tracking-normal text-sm font-medium text-white p-0 m-0'>{answer.fullName}</p>
                        </div>
                        <LiquipediaLink answer={answer}/>
                    </div>
                </div>
                <p className='text-center text-white uppercase font-bold sm:my-8 my-4 tracking-[0.04em] text-sm'>{FAIL_MODAL_BODY_TEXT_3}</p>
                <div className='flex justify-center items-center'>
                    <button 
                      className='uppercase font-black m-0 sm:text-xl text-lg tracking-wide min-h-[48px] py-3 px-8 text-black bg-indigo-500 hover:bg-indigo-300 outline-none border-none rounded cursor-pointer flex items-center justify-center transition-colors'
                      onClick={() => {
                        shareStatus(
                          answer,
                          guesses,
                          isGameLost,
                          isHighContrastMode,
                          handleShareToClipboard
                        )
                      }}
                    >
                      {FAIL_MODAL_BUTTON_TEXT}
                    </button>
                </div>
                <div className='h-[0.0625rem] w-full bg-white/20 sm:my-8 my-4 mx-auto'></div>
                <div className='text-center text-white'>
                    <div className='sm:text-base text-sm font-bold tracking-wide -mb-[8px]'>{FAIL_MODAL_FOOTER_TEXT}</div>
                    <Countdown
                      className="sm:text-[3rem] text-[2.5rem] font-black"
                      date={tomorrow}
                      daysInHours={true}
                    />
                </div>
            </div>
        </div>
    </div>  
  )
}

export default FailModal;