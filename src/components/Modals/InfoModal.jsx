import React, {useEffect, useRef} from 'react'
import Icon from '../../images/CloseIcon.png';
import Cursor from '../../images/icons8-hand-cursor.svg';
import Video from '../../images/93be8917b3b30485f653082415d79ff1.gif';

const InfoModal = ({closeModal}) => {
    const ref = useRef()

    function useOnClickOutside(ref, handler) {
        useEffect(
          () => {
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

  return (
    <div className='fixed w-[100vw] h-full min-h-[100vh] top-0 left-0 z-[500] bg-white/10 backdrop-blur-sm flex flex-col justify-start items-center p-4'>
        <div className='relative m-auto overflow-hidden sm:p-10 p-5 bg-[#0c101f] w-full max-w-[31.25rem] max-h-[calc(100vh-2.5rem)] outline-none flex flex-col rounded-md drop-shadow-lg' ref={ref}>
            <button className='flex items-center justify-center cursor-pointer absolute top-4 right-4 hover:opacity-70 transition-opacity' onClick={closeModal}><img src={Icon} height={24} width={24} alt='Exit Modal' className='invert'/></button>
            <div className='z-1 mt-6'>
                <div className='relative flex flex-col items-center text-center h-fit italic pb-5'>
                    <h1 className='uppercase sm:text-3xl text-2xl font-bold bg-clip-text text-white'>You have 6 attempts to guess the mystery RL player</h1>
                </div>
                <div className='flex flex-col justify-center items-center w-fit py-8 px-0 my-0 mx-auto text-white text-center sm:text-base text-sm max-h-[20rem] overflow-y-scroll'>
                    <div className='flex flex-col justify-center items-center px-4 mt-[9.5rem]'>
                    <div className='w-fit mb-3 mx-0'>
                        <div className='bg-[#147549] my-[0.125rem] mr-[0.125rem] ml-0 inline-block p-[0.5rem] rounded'>Green boxes</div>
                        <span> are correct answers.</span>
                    </div>
                    <div className='w-fit mb-3 mx-0'>
                        <div className='bg-[#9d5c3b] my-[0.125rem] mr-[0.125rem] ml-0 inline-block p-[0.5rem] rounded'>Orange boxes</div>
                        <span> are close answers.</span>
                    </div>
                    <div className='w-fit mb-3 mx-0'>
                        <div className='bg-[#151c36] my-[0.125rem] mr-[0.125rem] ml-0 inline-block p-[0.5rem] rounded'>Blank boxes</div>
                        <span> are incorrect answers.</span>
                    </div>
                    <div className='w-fit mb-3 mx-0'>
                        <div className='bg-[#151c36] my-[0.125rem] mr-[0.125rem] ml-0 inline-block p-[0.5rem] rounded'>↑</div>
                        <div className='bg-[#151c36] my-[0.125rem] mr-[0.125rem] ml-0 inline-block p-[0.5rem] rounded'>↓</div>
                        <span> arrows point to the correct answer.</span>
                    </div>
                    <div className='flex flex-row mb-5 w-fit mx-0'>
                      <div className='bg-[#151c36] my-[0.125rem] mr-[0.35rem] ml-0 p-[0.5rem] rounded flex items-center justify-center'>
                        <img src={Cursor} height={22} width={22} alt='Hover Cursor'/>
                      </div>
                      <span className='flex justify-center items-center'> hover over boxes for extra details.</span>

                    </div>
                    
                    <img src={Video} alt="" height={200} width={275}  className='rounded-md border-2 border-white drop-shadow-md'/>
                  </div>
                </div>
                <div className='flex justify-center items-center sm:mt-6 mt-0'>
                    <button className='uppercase font-black m-0 sm:text-xl text-lg tracking-wide min-h-[48px] py-3 px-8 text-black bg-indigo-500 hover:bg-indigo-300 outline-none border-none rounded cursor-pointer flex items-center justify-center transition-all' onClick={closeModal}>close</button>
                </div>
            </div>
        </div>
    </div> 
  )
}

export default InfoModal