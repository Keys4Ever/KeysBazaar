import { useState } from 'react';

const usePagination = (itemsPerPage, currentItemsLength) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

    const isNextDisabled = currentItemsLength < itemsPerPage || currentItemsLength === 0;
    const isPreviousDisabled = currentPage <= 1;

    return {
        currentPage,
        setCurrentPage,
        handleNextPage,
        handlePreviousPage,
        isNextDisabled,
        isPreviousDisabled,
    };
};

export default usePagination;
