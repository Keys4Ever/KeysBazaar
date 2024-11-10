import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import App from '@utils/App.jsx';
import Layout from '@components/layout.jsx';
import CatalogPage from '@pages/Catalog/CatalogPage.jsx';
import CartPage from '@pages/Cart/CartPage.jsx';
import AccountPage from '@pages/Account/AccountPage.jsx';
import CheckoutPage from '../pages/Checkout/ChechoutPage';

const ProductPage = lazy(() => import('@pages/Product/ProductPage'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Layout><App /></Layout>} />
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
