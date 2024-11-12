import { SocialSection, CopyRightSection, DataSection } from "../index.js";
import '../styles/Footer.css'

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
