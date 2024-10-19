import Footer from '@components/Footer/Footer.jsx';
import NavBar from '@components/NavBar/NavBar.jsx';

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
