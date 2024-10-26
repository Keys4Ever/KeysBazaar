import { useState, useEffect } from 'react';

export const useFetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const urlParams = new URLSearchParams(params);
            const response = await fetch(`http://localhost:3000/api/products?${urlParams}`);
            const data = await response.json();
            setProducts(data.products);
            setMore(data.more);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { products, more, loading, error, fetchProducts };
};

export const useFetchCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    return { categories };
};
