import { useState, useEffect } from "react";

const useCategories = () => {
    const [categories, setCategories] = useState([]);
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

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories };
};

export default useCategories;
