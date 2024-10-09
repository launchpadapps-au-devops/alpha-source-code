interface VectorProps {
    direction?: 'up' | 'down'; // Add a direction prop to handle up or down arrows
}

export const Vector = ({ direction = 'up' }: VectorProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="9"
            viewBox="0 0 16 9"
            fill="none"
        >
            {direction === 'up' ? (
                <path
                    d="M1.75 7.5L8 1.25L14.25 7.5"
                    stroke="#343330"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ) : (
                <path
                    d="M1.75 1.5L8 7.75L14.25 1.5"
                    stroke="#343330"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}
        </svg>
    );
};
