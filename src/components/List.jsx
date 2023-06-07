import React from 'react'
import Data from '../constants/players.json';

const List = ({input, handleClick, guess0, guess1, guess2, guess3, guess4, guess5}) => {
    const filteredData = Data.filter((el) => {
        if (input === "") {
            return null;
        }
        else {
            var filtered = el.name.toLowerCase().replace(/0/g, 'o').includes(input.replace(/0/g, 'o'));
            if (guess0.length !== 0) {
                filtered = filtered && el.id !== guess0.id;
            }
            if (guess1.length !== 0) {
                filtered = filtered && el.id !== guess1.id;
            }
            if (guess2.length !== 0) {
                filtered = filtered && el.id !== guess2.id;
            }
            if (guess3.length !== 0) {
                filtered = filtered && el.id !== guess3.id;
            }
            if (guess4.length !== 0) {
                filtered = filtered && el.id !== guess4.id;
            }
            if (guess5.length !== 0) {
                filtered = filtered && el.id !== guess5.id;
            }
            return filtered;
        }
    })

    if (filteredData.length === 0) {
        return (
            <ul>
                <li className='py-1'>No results found...</li>
            </ul>
        );

    } else {
        return (
            <ul>
                {filteredData.map((item) => (
                    <li 
                        tabindex="0" 
                        className='py-1 cursor-pointer hover:bg-[#151c36] transition-all rounded-sm font-medium tracking-wide' 
                        key={item.id} 
                        onClick={() => handleClick(item.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleClick(item.id);
                            }
                        }}
                    >
                        {item.name}  
                        <span className='font-light text-gray-250 tracking-normal'> - {item.fullName}</span>
                    </li>
                ))}
            </ul>
        );
    }      
}

export default List;