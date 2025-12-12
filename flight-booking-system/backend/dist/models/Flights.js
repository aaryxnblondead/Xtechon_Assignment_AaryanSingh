"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const flightSchema = new mongoose_1.Schema({
    flightId: {
        type: String,
        required: true,
        unique: true,
    },
    airline: {
        type: String,
        required: [true, 'Airline is required'],
    },
    departureCity: {
        type: String,
        required: [true, 'Departure city is required'],
    },
    arrivalCity: {
        type: String,
        required: [true, 'Arrival city is required'],
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: 2000,
        max: 3000,
    },
    currentPrice: {
        type: Number,
        required: true,
    },
    departureTime: {
        type: Date,
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    duration: Number,
    seatsAvailable: {
        type: Number,
        required: true,
    },
    totalSeats: {
        type: Number,
        required: true,
        default: 180,
    },
    bookingAttempts: [
        {
            timestamp: { type: Date, default: Date.now },
            userId: String,
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model('Flight', flightSchema);
//# sourceMappingURL=Flights.js.map