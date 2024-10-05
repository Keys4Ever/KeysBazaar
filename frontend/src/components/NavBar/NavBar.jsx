import { useState } from "react";
import NavRight from "./NavRight/NavRight.jsx";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import logo from "../../assets/images/react.svg";
import searchIcon from "../../assets/images/magnifying-glass.svg";
import clearIcon from "../../assets/images/clear-search.svg";

const NavBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm) {
            navigate(`/catalog?search=${trimmedSearchTerm}`);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
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
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <button
                        type="submit"
                        className="search-icon"
                        aria-label="Search products"
                    >
                        <img
                            src={searchIcon}
                            width="20"
                            height="20"
                            alt="Search"
                            aria-hidden="true"
                        />
                    </button>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        aria-label="Search products"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="clear-search"
                            onClick={handleClearSearch}
                            aria-label="Clear search"
                        >
                            <img
                                src={clearIcon}
                                width="20"
                                height="20"
                                alt="Clear"
                                aria-hidden="true"
                            />
                        </button>
                    )}
                </form>
            </div>
            <NavRight />
        </nav>
    );
};

export default NavBar;
