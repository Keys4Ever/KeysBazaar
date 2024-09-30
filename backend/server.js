import express from 'express';
import turso from './config/turso.js';
import dotenv from 'dotenv';
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;

// Import routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

const app = express();
const port = 3000;

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASEURL,
    clientID: process.env.AUTH0_CLIENTID,
    issuerBaseURL: process.env.AUTH0_ISSUERBASE
  };
  
app.use(auth(config));
  

app.use(express.json());

// Define basic route
/* app.get('/', (req, res) => {
    res.send('Keysbazaar api.');
}); */


// Rutas
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Ruta protegida
app.get('/profile', (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/logout', (req, res) => {
    res.oidc.logout({
      returnTo: "http://localhost:3000",
    });
  });
  

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});