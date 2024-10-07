import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import App from '../utils/App.jsx';
import Layout from '../components/layout.jsx';
import Catalog from '../pages/Catalog/Catalog.jsx';

const ProductPage = lazy(() => import('../pages/Product/ProductPage'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Layout><App /></Layout>} />
                <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
                <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
