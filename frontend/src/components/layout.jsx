import Footer from './Footer/Footer.jsx';
import NavBar from './NavBar/NavBar.jsx';

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
