import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavRight from "./NavRight/NavRight.jsx";
import SearchBar from "@components/SearchBar/SearchBar.jsx";
import SearchResultsList from "@components/SearchBar/SearchResultsList/SearchResultsList.jsx";
import "./NavBar.css";
import logo from "@assets/images/react.svg";

const NavBar = () => {
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

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
                <SearchBar setResults={setSearchResults} />
                {searchResults.length > 0 && <SearchResultsList results={searchResults} />}
            </div>
            <NavRight />
        </nav>
    );
};

export default NavBar;
