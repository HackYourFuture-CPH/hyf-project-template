import React from 'react';

const Button = ({styles}) => {
    return (
        <button type="button" className={`py-4 px-6 text-[18px] rounded-[10px] outline-none ${styles}`}>
            Log ind
        </button>
    );
}

export default Button;