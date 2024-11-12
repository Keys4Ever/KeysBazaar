import { useAuth } from "@utils/Utils.js"


const LoginButton = () =>{
    const {login} = useAuth();
    return(
        <button onClick={login}>Login</button>
    )
}

export default LoginButton;