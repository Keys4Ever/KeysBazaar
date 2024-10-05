import NavBar from './NavBar/NavBar.jsx';

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            <main>{children}</main>
        </>
    );
};

export default Layout;
