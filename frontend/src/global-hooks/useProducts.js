import { useState, useCallback, useEffect } from "react";

const useProducts = ({ id = null, search = "", minPrice = null, maxPrice = null, categories = [], limit = 10, offset = 0 } = {}) => {
    const [products, setProducts] = useState(id ? null : []);
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            if (!id) setProducts([]);

            const baseUrl = `http://localhost:3000/api/products`;
            let url;

            if (id) {
                url = `${baseUrl}/${id}`;
            } else {
                const queryParams = new URLSearchParams({
                    search,
                    minPrice: minPrice !== null ? minPrice : "",
                    maxPrice: maxPrice !== null ? maxPrice : "",
                    limit: String(limit),
                    offset: String(offset)
                });
                categories.forEach(category => queryParams.append("categories", category));
                url = `${baseUrl}?${queryParams.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                if (id) {
                    setProducts(data);
                } else {
                    setProducts(data.products);
                    setMore(data.more);
                }
            } else {
                console.error("Error fetching products:", data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [id, search, minPrice, maxPrice, categories, limit, offset]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, more, fetchProducts, loading };
};

export default useProducts;
