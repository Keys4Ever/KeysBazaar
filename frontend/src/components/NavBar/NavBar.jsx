import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/catalog?search=${searchTerm}`);
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
                <img src="/logo.png" alt="Logo" className="logo" />
            </div>

            <div className="nav-middle">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <button
                        type="submit"
                        className="search-icon"
                        aria-label="Search products"
                    >
                        <img 
                            src="/assets/images/magnifying-glass.svg" 
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
                                src="/assets/images/clear-search.svg" 
                                width="20" 
                                height="20" 
                                alt="Clear" 
                                aria-hidden="true" 
                            />
                        </button>
                    )}
                </form>
            </div>

            <div className="nav-right">
                <button onClick={() => navigate("/catalog")}>Catalog</button>
                <button onClick={() => navigate("/cart")}>Cart</button>
                <div className="dropdown">
                    <button aria-haspopup="true" aria-expanded="false">
                        Account
                    </button>
                    <div className="dropdown-content" aria-label="User menu">
                        <a href="#" onClick={() => navigate("/user/account")}>
                            Account
                        </a>
                        <a href="#" onClick={() => navigate("/user/something1")}>
                            Something 1
                        </a>
                        <a href="#" onClick={() => navigate("/user/something2")}>
                            Something 2
                        </a>
                        <a href="#" onClick={() => navigate("/user/settings")}>
                            Settings
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
