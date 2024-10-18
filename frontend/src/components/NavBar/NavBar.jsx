import { useNavigate } from "react-router-dom";
import NavRight from "./NavRight/NavRight.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import "./NavBar.css";
import logo from "../../assets/images/react.svg";

const NavBar = () => {
    const navigate = useNavigate();

    const handleSearch = (searchTerm) => {
        if (searchTerm) {
            navigate(`/catalog?search=${searchTerm}`);
        } else {
            navigate("/catalog");
        }
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
                <SearchBar onSearch={handleSearch} />
            </div>
            <NavRight />
        </nav>
    );
};

export default NavBar;
