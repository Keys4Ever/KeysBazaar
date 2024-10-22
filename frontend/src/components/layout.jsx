import Footer from '@components/Footer/Footer.jsx';
import NavBar from '@components/NavBar/NavBar.jsx';
import { AuthProvider } from '../context/authContext';

const Layout = ({ children }) => {
    return (
        <>
        <AuthProvider>
            <NavBar />
            <main>{children}</main>
            <Footer />
        </AuthProvider>
        </>
    );
};

export default Layout;
