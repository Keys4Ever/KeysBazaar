import React from "react";

const NavRight = () =>{
    return (
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
    )
}
export default NavRight;