import { useState } from "react";
import "./PersonalInfo.css";

const PersonalInfo = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit updated info to the server :D
    };

    // Idk if we want this tbh, copied it from other webs
    return (
        <form onSubmit={handleSubmit} className="personal-info-form">
            <h2>Personal Information</h2>
            <label>
                Name:
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
            </label>
            <label>
                Email:
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
            </label>
            <label>
                Password:
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </label>
            <button type="submit">Update Information</button>
        </form>
    );
};

export default PersonalInfo;