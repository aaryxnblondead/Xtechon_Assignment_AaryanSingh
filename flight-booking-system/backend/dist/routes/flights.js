"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const flightController_1 = require("../controllers/flightController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/search', flightController_1.searchFlights);
router.get('/:flightId', flightController_1.getFlightDetails);
router.get('/:flightId/surge-pricing', auth_1.authenticate, flightController_1.checkSurgePricing);
exports.default = router;
//# sourceMappingURL=flights.js.map