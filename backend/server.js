import express from 'express';
import turso from './config/turso.js';
import dotenv from 'dotenv';

// Import routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

const app = express();
const port = 3000;
app.use(express.json());

const db = turso;

// Define basic route
app.get('/', (req, res) => {
    res.send('Keysbazaar api.');
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});