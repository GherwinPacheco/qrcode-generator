import React, {useState} from 'react';

export const Button = ({children, className, onClick = () => {}, ...rest}) => {

    const [isClicked, setIsClicked] = useState(false);
    const defaultClassName = `
        px-5
        py-2
        border
        shadow-md
        rounded-md
        font-semibold
        duration-300
        active:bg-black
        active:text-white
        disabled:bg-gray-500
    `;

    const handleClick = () => {
        setIsClicked(true);

        setTimeout(() => {
            setIsClicked(false);
        }, 200);
    }
  
    return (
        <button 
            className={`${defaultClassName} ${className}`} 
            onClick={() => {
                handleClick();
                onClick();
            }}
            {...rest}
        >
            {children}
        </button>
    );
};

export const Label = ({children, className, ...rest}) => {
    const defaultClassName = `
        text-gray-900
    `;

    return (
        <label className={`${defaultClassName} ${className}`} {...rest}>{children}</label>
    );
}


export const Input = ({className, ...rest}) => {

    const defaultClassName = `
        block
        px-2
        py-1
        rounded-sm
        border
        border-gray-300
        focus:shadow-lg
        focus:ring
        focus:ring-2
        focus:ring-blue-300
        focus:outline-0
        duration-300
    `;

    return (
        <input
            className={`${defaultClassName} ${className}`} 
            {...rest} 
        />
    );
};

export const Select = ({children, className, ...rest}) => {
    const defaultClassName = `
        block
        px-2
        py-1
        rounded-sm
        border
        border-gray-300
        focus:shadow-lg
        focus:ring
        focus:ring-2
        focus:ring-blue-300
        focus:outline-0
        duration-300
    `;

    return (
        <select
            className={`${defaultClassName} ${className}`} 
            {...rest} 
        >
            {children}
        </select>
    );
}

export const Checkbox = ({className, ...rest}) => {
    const defaultClassName = `
        rounded-sm
        border
        border-gray-300
        focus:shadow-lg
        focus:ring
        focus:ring-2
        focus:ring-blue-300
        focus:outline-0
        duration-300
    `;

    return (
        <input
            {...rest} 
            type='checkbox'
            className={`${defaultClassName} ${className}`} 
            
        />
    );
}
