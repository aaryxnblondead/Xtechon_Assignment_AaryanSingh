import express, { Router } from 'express';
import { searchFlights, getFlightDetails, checkSurgePricing } from '../controllers/flightController';
import { authenticate } from '../middleware/auth';

const router: Router = express.Router();

router.get('/search', searchFlights);
router.get('/:flightId', getFlightDetails);
router.get('/:flightId/surge-pricing', authenticate, checkSurgePricing);

export default router;
