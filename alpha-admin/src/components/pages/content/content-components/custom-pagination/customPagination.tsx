import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './customPagination.module.scss';

interface CustomPaginationProps {
  onNextPage: () => void;
  onPreviousPage: () => void;
  currentPage: number;
  totalPages: number;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({ onNextPage, onPreviousPage, currentPage, totalPages }) => {
  return (
    <div className={styles['table-footer-wrapper']}>
      <button className={styles['prev-button']} onClick={onPreviousPage} disabled={currentPage <= 1}>
        <FontAwesomeIcon icon={faChevronLeft} /> Back
      </button>
      <span className={styles['page-info']}>
        {currentPage}
      </span>
      <button className={styles['next-button']} onClick={onNextPage} disabled={currentPage >= totalPages}>
        Next <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};
