"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/book', auth_1.authenticate, bookingController_1.bookFlight);
router.get('/history', auth_1.authenticate, bookingController_1.getBookingHistory);
router.get('/wallet/balance', auth_1.authenticate, bookingController_1.getWalletBalance);
router.get('/:pnr/download-ticket', bookingController_1.downloadTicket);
router.post('/:pnr/cancel', auth_1.authenticate, bookingController_1.cancelBooking);
exports.default = router;
//# sourceMappingURL=bookings.js.map