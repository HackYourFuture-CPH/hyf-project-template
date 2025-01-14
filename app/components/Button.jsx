import React from 'react';

const Button = ({styles}) => {
    return (
        <button type="button" className={`py-2 px-6 w-fit text-[18px] font-bold bg-[#636AE8] text-white rounded-[10px] outline-none hover:bg-blue-700 duration-700 ${styles}`}>
            Log ind
        </button>
    );
}

export default Button;