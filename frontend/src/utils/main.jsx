import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@routes/routes.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <AppRoutes />
  </Router>
);
