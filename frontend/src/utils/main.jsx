import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ProductPage from '../pages/Product/ProductPage';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  </Router>
);
