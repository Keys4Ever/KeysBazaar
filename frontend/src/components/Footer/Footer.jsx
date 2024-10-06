
import { useNavigate } from "react-router-dom";
import SocialSection from "./sections/SocialSection.jsx"
import CopyRightSection from "./sections/CopyrightSection.jsx";
import DataSection from "./sections/DataSection.jsx";
import './Footer.css'

const Footer = () => {
    
    return(
        <footer className="footer">
            <SocialSection />
            <CopyRightSection/>
            <DataSection />
        </footer>

    );
};

export default Footer;
