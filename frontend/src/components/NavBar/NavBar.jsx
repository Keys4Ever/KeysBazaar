import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavRight from "./NavRight/NavRight.jsx";
import SearchBar from "@components/SearchBar/SearchBar.jsx";
import SearchResultsList from "@components/SearchBar/SearchResultsList/SearchResultsList.jsx";
import "./NavBar.css";
import logo from "@assets/images/react.svg";

const NavBar = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [products, setProducts] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();


    const fetchMinimalProducts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/names-and-ids`);
            const data = await response.json();
            setProducts(data.products);
        } catch (error) {
            console.error("Error fetching minimal products:", error);
        }
    }

    // Fetching product data on mount
    useEffect(() => {
        fetchMinimalProducts();
    }, []);

    // Searching functionality
    const handleSearch = useCallback(
        (query) => {
            const lowerQuery = query.toLowerCase();
            const filteredResults = products.filter((product) =>
                product.title.toLowerCase().includes(lowerQuery)
            );
            setSearchResults(filteredResults);
            setShowResults(query.length > 0); // Show results if there's a query
        },
        [products]
    );

    // Handle blur event to hide results
    const handleBlur = () => {
        setTimeout(() => {
            setShowResults(false); // Hide results after a short delay
        }, 200);
    };

    return (
        <nav className="nav-bar">
            <div 
                className="nav-left"
                onClick={() => navigate("/")}
                aria-label="Go to Home"
            >
                <img src={logo} alt="Logo" className="logo" />
            </div>

            <div className="nav-middle">
                <SearchBar onSearch={handleSearch} onBlur={handleBlur} />
                {showResults && (
                    <SearchResultsList results={searchResults} allProducts={products} />
                )}
            </div>
            <NavRight />
        </nav>
    );
};

export default NavBar;
