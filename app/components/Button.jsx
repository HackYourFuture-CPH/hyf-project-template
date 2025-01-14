import React from 'react';

const Button = ({styles, value, onClick}) => {
    
    const onClickHandler = () => {
        onClick();
    }

    return (
        <button onClick={onClickHandler} type="button" className={`py-2 px-6 w-fit text-[18px] font-bold bg-blue-500 text-white rounded-[10px] outline-none hover:bg-blue-700 duration-500 ${styles}`}>
            {value}
        </button>
    );
}

export default Button;