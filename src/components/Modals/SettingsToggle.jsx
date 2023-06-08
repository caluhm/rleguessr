import React from 'react'

export const SettingsToggle = ({
  settingName,
  flag,
  handleFlag,
  description,
}) => {

  var backgroundColour = flag ? 'bg-green-500' : 'bg-gray-300'
  var translateX = flag ? 'translate-x-6' : ''

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <div className="mt-2 text-left text-white font-medium">
          <p className="leading-none">{settingName}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-200 font-normal">
              {description}
            </p>
          )}
        </div>
        <div className={`w-14 h-8 flex shrink-0 items-center ${backgroundColour} rounded-full p-1 duration-300 ease-in-out cursor-pointer`} onClick={() => handleFlag(!flag)}>
          <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out cursor-pointer ${translateX}`} />
        </div>
      </div>
    </>
  )
}