import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './customPagination.module.scss';

interface CustomPaginationProps {
    onNextPage: () => void;
    onPreviousPage: () => void;
    // onPageChange: (pageNumber: number) => void; // New prop for page change
    currentPage: number;
    totalPages: number;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
    onNextPage,
    onPreviousPage,
    // onPageChange,
    currentPage,
    totalPages,
}) => {
    const renderPageNumbers = () => {
        let pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    // onClick={() => onPageChange(i)}
                    className={`${styles['page-number']} ${currentPage === i ? styles['active'] : ''}`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className={styles['table-footer-wrapper']}>
            <button
                className={styles['prev-button']}
                onClick={onPreviousPage}
                disabled={currentPage <= 1}
            >
                <FontAwesomeIcon icon={faChevronLeft} /> Back
            </button>
            <div className={styles['page-numbers']}>
                {renderPageNumbers()}
            </div>
            <button
                className={styles['next-button']}
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
            >
                Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};
