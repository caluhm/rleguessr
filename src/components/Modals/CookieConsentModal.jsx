import React from 'react'

const CookieConsentModal = ({handleAcceptCookies, handleDeclineCookies, handlePolicyModal}) => {
  return (
    <div className='fixed w-[100vw] h-full min-h-[100vh] top-0 left-0 z-[500] bg-white/10 backdrop-blur-sm flex flex-col justify-start items-center'>
      <div className='relative mb-auto overflow-hidden sm:p-5 p-3 bg-[#0c101f] w-full h-[10rem] outline-none flex flex-row justify-between drop-shadow-lg'>
        <div className='flex h-full w-[70%] sm:text-center text-left items-center justify-center sm:gap-1.5 gap-3 text-white sm:text-base text-sm flex-col'>
            <p>RLE Guessr uses non-essential cookies from Google Analytics to help enhance your experience.</p> 
            <p className='sm:text-sm text-xs font-light'>By clicking "Accept", you consent to the use of cookies. View the <button className='text-indigo-500 underline font-light sm:text-sm text-xs' onClick={handlePolicyModal}>Privacy and Cookie Policy</button> here.</p>
        </div>
        <div className='w-[0.0625rem] h-full bg-white/20 sm:mx-4 mx-2 my-auto'></div>
        <div className='flex h-full w-[30%] items-center justify-center sm:flex-row flex-col gap-5 sm:p-0 p-2'>
            <button 
                className='sm:text-base text-sm text-white font-semibold bg-green-500 hover:bg-green-700 sm:w-[8rem] w-full h-[2.5rem] rounded-md transition-colors ease-in-out'
                onClick={handleAcceptCookies}
            >
                Accept
            </button>
            <button 
                className='sm:text-base text-sm text-white font-semibold bg-gray-500 hover:bg-gray-700 sm:w-[8rem] w-full h-[2.5rem] rounded-md transition-colors ease-in-out'
                onClick={handleDeclineCookies}
            >
                Decline
            </button>
        </div>
        
      </div>
  </div>
  )
}

export default CookieConsentModal