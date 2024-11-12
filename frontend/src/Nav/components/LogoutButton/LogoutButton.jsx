import { useAuth } from "@utils/Utils.js"


const LogoutButton = () =>{
    const {logout} = useAuth();
    return(
        <button onClick={logout}>Logout</button>
    )
}

export default LogoutButton;