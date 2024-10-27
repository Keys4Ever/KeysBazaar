const Pagination = ({ currentPage, hasNextPage, onPageChange }) => {
    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span>Page {currentPage}</span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
