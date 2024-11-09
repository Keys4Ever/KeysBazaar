import express from 'express';
import { 
    initiatePayment, 
    capturePayment, 
    getOrderHistory, 
    getOrderDetails 
} from '../controllers/paypalController.js'

const router = express.Router();

router.post('/initiate', initiatePayment);
router.get('/capture', capturePayment);
router.get('/history/:provider_id', getOrderHistory);
router.get('/orders/:orderId', getOrderDetails);

export default router;