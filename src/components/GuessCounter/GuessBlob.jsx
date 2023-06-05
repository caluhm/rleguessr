import React from 'react'

const GuessBlob = ({
    checked
}) => {

    const blobColour = checked ? 'bg-indigo-500' : 'bg-[#28335a]';

  return (
    <div className={`${blobColour} rounded h-[5px] w-[15px]`}></div>
  )
}

export default GuessBlob
