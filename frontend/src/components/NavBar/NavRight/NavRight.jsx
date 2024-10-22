import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/authContext";
import LoginButton from "../../LoginButton/LoginButton";
import LogoutButton from "../../LogoutButton/LogoutButton";

const NavRight = () =>{
    const {auth} = useAuth();
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
                { auth.authenticated ? <a href="#" onClick={() => navigate("/account")}>
                    Account
                </a> : <LoginButton /> }
                <a href="#" onClick={() => navigate("/user/something1")}>
                    Something 1
                    { /* Opened part of user (?) */ }
                </a>
                { auth.authenticated && <LogoutButton/>}
            </div>
        </div>
    </div>
    )
}
export default NavRight;