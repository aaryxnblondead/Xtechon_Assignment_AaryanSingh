import express, { Router } from 'express';
import {
  bookFlight,
  getBookingHistory,
  downloadTicket,
  getWalletBalance,
  cancelBooking,
} from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router: Router = express.Router();

router.post('/book', authenticate, bookFlight);
router.get('/history', authenticate, getBookingHistory);
router.get('/wallet/balance', authenticate, getWalletBalance);
router.get('/:pnr/download-ticket', downloadTicket);
router.post('/:pnr/cancel', authenticate, cancelBooking);

export default router;
