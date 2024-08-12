import React from 'react';

interface DeleteProps {
    onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export const Delete: React.FC<DeleteProps> = ({ onClick }) => {
    return (
        <svg
            onClick={onClick}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10 2C10 1.44772 10.4477 1 11 1H13C13.5523 1 14 1.44772 14 2V3H19C19.5523 3 20 3.44772 20 4V5C20 5.55228 19.5523 6 19 6H5C4.44772 6 4 5.55228 4 5V4C4 3.44772 4.44772 3 5 3H10V2ZM6 8V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V8H16V18H8V8H6Z"
                fill="#D7153A"
            />
        </svg>
    );
};
