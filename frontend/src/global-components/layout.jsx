import Footer from '../Footer/mainComponent/Footer.jsx';
import NavBar from '../Nav/mainComponent/NavBar.jsx';
import { AuthProvider } from '@utils/Utils.js';

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
