// TableFooter.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import './TableFooter.module.scss';

interface TableFooterProps {
  onNextPage: () => void;
  onPreviousPage: () => void;
  currentPage: number;
  totalPages: number;
}

export const TableFooter: React.FC<TableFooterProps> = ({ onNextPage, onPreviousPage, currentPage, totalPages }) => {
  return (
    <div className="table-footer">
      {/* <button className="prev-button" onClick={onPreviousPage} disabled={currentPage <= 1}>
        <FontAwesomeIcon icon={faChevronLeft} /> Back
      </button>
      <span className="page-info">
      {currentPage} 
      </span>
      <button className="next-button" onClick={onNextPage} disabled={currentPage >= totalPages}>
        Next <FontAwesomeIcon icon={faChevronRight} />
      </button> */}
    </div>
  );
};

