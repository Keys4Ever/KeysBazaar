import { useState, useCallback } from "react";

const useProducts = ( id = null ) => {
    const [products, setProducts] = useState([]);
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const baseUrl = `http://localhost:3000/api/products/${id ? id : ''}`
    const fetchProducts = useCallback(async ({ search = "", minPrice = null, maxPrice = null, categories = [], limit = 10, offset = 0 }) => {
        try {
            setLoading(true);
            setProducts([]); // Clear products before fetching new 

            const queryParams = new URLSearchParams({
                search,
                minPrice: minPrice !== null ? minPrice : "",
                maxPrice: maxPrice !== null ? maxPrice : "",
                limit: String(limit),
                offset: String(offset)
            });

            // Append categories to query params
            categories.forEach(category => queryParams.append("categories", category));

            const response = await fetch(`${baseUrl}?${queryParams.toString()}`);
            const data = await response.json();

            if (response.ok) {
                setProducts(data.products);
                setMore(data.more);
            } else {
                console.error("Error fetching products:", data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { products, more, fetchProducts, loading };
};

export default useProducts;
