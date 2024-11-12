import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../Home/pages/Home.jsx';
import Layout from '@components/layout.jsx';
import CatalogPage from '../Catalog/pages/CatalogPage.jsx';
import CartPage from '../Cart/pages/CartPage.jsx';
import AccountPage from '../Account/pages/AccountPage.jsx';
import CheckoutPage from '../Checkout/pages/ChechoutPage.jsx';

const ProductPage = lazy(() => import('../Product/pages/ProductPage.jsx'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
                <Route path="/catalog" element={<Layout><CatalogPage /></Layout>} />
                <Route path='/cart' element={<Layout><CartPage /></Layout>} />
                <Route path="/account" element={<Layout><AccountPage /></Layout>} />
                <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
