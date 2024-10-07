import { useState } from 'react';

const usePagination = (items, itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (indexOfLastItem < items.length) {
            window.scrollTo(0, 0);
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            window.scrollTo(0, 0);
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const isNextDisabled = indexOfLastItem >= items.length;

    return {
        currentItems,
        currentPage,
        handleNextPage,
        handlePreviousPage,
        isNextDisabled
    };
};

export default usePagination;
