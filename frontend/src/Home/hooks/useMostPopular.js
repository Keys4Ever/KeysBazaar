import { useState, useEffect } from 'react';

const useMostPopularProduct = (limit = 1) => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/most-popular?limit=${limit}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch the most popular products');
                }
                return response.json();
            })
            .then((data) => setPopularProducts(data))
            .catch((err) => setError(err.message));
    }, [limit]);

    return { popularProducts, error };
};

export default useMostPopularProduct;
