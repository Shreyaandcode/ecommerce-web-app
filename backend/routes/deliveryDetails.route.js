import express from 'express';
import { saveDeliveryDetails, getDeliveryDetails } from '../controllers/deliveryDetails.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, saveDeliveryDetails);
router.get('/', protectRoute, getDeliveryDetails);

export default router;
