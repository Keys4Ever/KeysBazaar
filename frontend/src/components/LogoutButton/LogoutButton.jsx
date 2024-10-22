import { useAuth } from "../../context/authContext"


const LogoutButton = () =>{
    const {logout} = useAuth();
    return(
        <button onClick={logout}>Logout</button>
    )
}

export default LogoutButton;