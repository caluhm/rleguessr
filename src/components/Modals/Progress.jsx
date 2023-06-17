import React from 'react'
import classNames from 'classnames'

const Progress = ({
  index,
  size,
  label,
  isCurrentDayStatRow,
}) => {
  const currentRowClass = classNames(
    'text-xs font-medium text-blue-100 text-center p-0.5 rounded-r',
    { 'bg-indigo-500': isCurrentDayStatRow, 'bg-[#28335a]': !isCurrentDayStatRow }
  )
  return (
    <div className="justify-left m-1 flex">
      <div className="w-2 items-center justify-center text-white text-center">{index + 1}</div>
      <div className="ml-2 w-full">
        <div style={{ width: `${8 + size}%` }} className={currentRowClass}>
          {label}
        </div>
      </div>
    </div>
  )
}

export default Progress
