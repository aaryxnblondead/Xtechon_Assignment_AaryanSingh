import express, { Router } from 'express';
import { bookFlight, getBookingHistory, getBookingByPNR, downloadTicket, getWalletBalance, cancelBooking } from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';
import { validateRequest, bookFlightSchema } from '../middleware/validation';

const router: Router = express.Router();

router.post('/book', authenticate, validateRequest(bookFlightSchema), bookFlight);
router.get('/history', authenticate, getBookingHistory);
router.get('/wallet/balance', authenticate, getWalletBalance);
router.get('/:pnr', getBookingByPNR);
router.get('/:pnr/download-ticket', downloadTicket);
router.post('/:pnr/cancel', authenticate, cancelBooking);

export default router;
