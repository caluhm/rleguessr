import React, {useEffect, useRef} from 'react'
import Icon from '../../images/CloseIcon.png';
import { SettingsToggle } from './SettingsToggle';
import {
    SETTINGS_MODAL_HEADER_TEXT,
    SETTINGS_MODAL_CONTRAST_SETTING_NAME_TEXT,
    SETTINGS_MODAL_CONTRAST_SETTING_DESCRIPTION_TEXT
} from '../../constants/strings'

const SettingsModal = ({closeModal, isHighContrastMode, handleHighContrastMode}) => {
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
    <div className={`fixed w-[100vw] h-full min-h-[100vh] top-0 left-0 z-[500] bg-white/10 backdrop-blur-sm flex flex-col justify-start items-center p-4`}>
        <div className='relative m-auto overflow-hidden sm:p-10 p-5 bg-[#0c101f] w-full max-w-[31.25rem] max-h-[calc(100vh-2.5rem)] outline-none flex flex-col rounded-md drop-shadow-lg' ref={ref}>
            <button className='flex items-center justify-center cursor-pointer absolute top-4 right-4 hover:opacity-70 transition-opacity' onClick={closeModal}><img src={Icon} height={24} width={24} alt='Exit Modal' className='invert'/></button>
            <div className='z-1 mt-6'>
                <div className='relative flex flex-col items-center text-center h-fit sm:pb-6 pb-2'>
                  <h1 className='uppercase sm:text-3xl text-2xl font-bold bg-clip-text text-white'>{SETTINGS_MODAL_HEADER_TEXT}</h1>
                </div>
                <div className='py-6 px-0'>
                    <SettingsToggle
                        settingName={SETTINGS_MODAL_CONTRAST_SETTING_NAME_TEXT}
                        flag={isHighContrastMode}
                        handleFlag={handleHighContrastMode}
                        description={SETTINGS_MODAL_CONTRAST_SETTING_DESCRIPTION_TEXT}
                    />
                </div>
                <div className='flex justify-center items-center sm:mt-6 mt-4'>
                    <button className='uppercase font-black m-0 sm:text-xl text-lg tracking-wide min-h-[48px] py-3 px-8 text-black bg-indigo-500 hover:bg-indigo-300 outline-none border-none rounded cursor-pointer flex items-center justify-center transition-colors' onClick={closeModal}>close</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SettingsModal