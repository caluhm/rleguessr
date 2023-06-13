import React, {useRef, useEffect} from 'react'
import Icon from '../../images/CloseIcon.png';

const PrivacyModal = ({closeModal}) => {
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
            <div className='z-1 mt-6 max-h-[37.5rem] overflow-y-auto'>
                <div className='p-1 text-white text-sm'>
                <h2 className='font-bold pb-1'>Cookie Policy: Google Analytics Cookies</h2>
                <p>
                Provider: Google LLC 
                <br/>
                <br/>
                Technical Details:<br/> Google Analytics uses cookies to collect information about website usage. The cookies store unique identifiers to recognize users across different visits and track user interactions on the website.<br/><br/>
                Duration:<br/> The duration of Google Analytics cookies varies. Some cookies may expire after the user's session ends, while others can last for up to two years.<br/><br/>
                Purpose:<br/> Google Analytics cookies are used to analyze website traffic and provide valuable insights to improve the user experience and performance of the website. The collected data includes information such as the number of visitors, the source of traffic, and user behavior on the website. This information helps website owners understand how users engage with their site and make informed decisions for optimization and marketing strategies.<br/><br/>
                The specific Google Analytics cookies used on the RLE Guessr website may include:
                <br/>
                <br/>
                - _ga<br/>
                Technical Details: This cookie is used to distinguish unique users by assigning a randomly generated number as a client identifier.<br/>
                Duration: 2 years<br/>
                Purpose: This cookie enables Google Analytics to track user interactions and generate statistical data about website usage.<br/>
                <br/>
                <br/>
                - _gid<br/>
                Technical Details: This cookie is used to distinguish users and store information about their session.<br/>
                Duration: 24 hours<br/>
                Purpose: The _gid cookie helps Google Analytics differentiate between users and analyze their browsing behavior within a single session.<br/>
                <br/>
                <br/>
                - _gat<br/>
                Technical Details: This cookie is used to throttle the request rate to Google Analytics, limiting the collection of data on high-traffic websites.<br/>
                Duration: 1 minute<br/>
                Purpose: The _gat cookie helps optimize data collection and improve the efficiency of Google Analytics.<br/>
                </p>
                <h2 className='font-bold pt-5 pb-1'>Privacy Policy: Google Analytics Cookies</h2>
                <p>
                At RLE Guessr, we use Google Analytics, a web analytics service provided by Google LLC ("Google"). Google Analytics uses cookies to collect information about how users interact with our website. The information generated by the cookies will be transmitted to and stored by Google on servers in the United States. Google will use this information for the purpose of evaluating website usage, compiling reports on website activity for website operators, and providing other services relating to website activity and internet usage.
                <br/>
                <br/>
                The data collected by Google Analytics cookies includes, but is not limited to, the following:
                <br/>
                <br/>
                - The number of visitors to our website<br/>
                - The source from which visitors arrived at our website<br/>
                - Pages visited on our website <br/>       
                - Time spent on each page<br/>
                - Interactions with website elements<br/>
                - User demographics<br/><br/>

                We use this information to understand how our website is performing and to improve the user experience. It helps us make data-driven decisions to enhance our services and tailor our content to better meet our users' needs.
                <br/>
                <br/>
                By using our website, you consent to the processing of data about you by Google in the manner and for the purposes set out above. You can learn more about Google's privacy practices by visiting their <a className='text-indigo-500 underline' href='https://policies.google.com/privacy?hl=en-US' target='_blank' rel='noreferrer'>Privacy Policy</a> page.
                </p>
                </div>
                <div className='flex justify-center items-center sm:mt-6 mt-4'>
                    <button className='uppercase font-black m-0 sm:text-xl text-lg tracking-wide min-h-[48px] py-3 px-8 text-black bg-indigo-500 hover:bg-indigo-300 outline-none border-none rounded cursor-pointer flex items-center justify-center transition-all' onClick={closeModal}>close</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PrivacyModal