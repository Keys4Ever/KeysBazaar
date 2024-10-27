import { useState, useEffect } from "react";

const useCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/categories");
                const data = await response.json();

                if (response.ok) {
                    setCategories(data);
                } else {
                    console.error("Error fetching categories:", data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return { categories };
};

export default useCategories;
