import React from 'react';
import './PaginationControls.css';

const PaginationControls = ({ currentPage, handlePreviousPage, handleNextPage, isNextDisabled }) => {
    return (
        <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
            </button>
            <span>Page {currentPage}</span>
            <button onClick={handleNextPage} disabled={isNextDisabled}>
                Next
            </button>
        </div>
    );
};

export default PaginationControls;