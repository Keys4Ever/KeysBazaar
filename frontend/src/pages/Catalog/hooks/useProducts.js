import { useState, useCallback } from "react";
const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const fetchProducts = useCallback(async ({ search, minPrice, maxPrice, categories, limit, offset }) => {

        try {
            setLoading(true); // Set loading to true when fetching starts
            const queryParams = new URLSearchParams({
                search: search || '',
                minPrice: minPrice ? String(minPrice) : '',
                maxPrice: maxPrice ? String(maxPrice) : '',
                categories: categories.length > 0 ? categories.join(',') : '',
                limit: String(limit || 10),
                offset: String(offset || 0),
            });

            const response = await fetch(`http://localhost:3000/api/products?${queryParams.toString()}`);
            const data = await response.json();

            if (response.ok) {
                console.log("Fetched products:", data.products); // Debug log
                setProducts(data.products);
                setMore(data.more);
            } else {
                console.error("Error fetching products:", data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false); // Set loading to false when fetching finishes
        }
    }, []);
    
    return { products, more, fetchProducts, loading }; // Return loading state as well
};
export default useProducts;