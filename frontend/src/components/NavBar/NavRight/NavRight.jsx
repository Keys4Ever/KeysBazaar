import { useNavigate } from "react-router-dom";

const NavRight = () =>{
    const navigate = useNavigate();

    return (
        <div className="nav-right">
        <button onClick={() => navigate("/catalog")}>Catalog</button>
        <button onClick={() => navigate("/cart")}>Cart</button>
        <div className="dropdown">
            <button aria-haspopup="true" aria-expanded="false">
                Account
            </button>
            <div className="dropdown-content" aria-label="User menu">
                <a href="#" onClick={() => navigate("/account")}>
                    Account
                </a>
                <a href="#" onClick={() => navigate("/user/something1")}>
                    Something 1
                    { /* Opened part of user (?) */ }
                </a>
                <a href="#" onClick={() => navigate("/user/something2")}>
                    Something 2
                </a>
            </div>
        </div>
    </div>
    )
}
export default NavRight;