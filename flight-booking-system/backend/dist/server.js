"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const flights_1 = __importDefault(require("./routes/flights"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flight-booking';
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files for PDFs
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
// CORS
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
// Database Connection
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('✅ MongoDB connected');
    console.log(`   Database: ${MONGODB_URI}`);
})
    .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/flights', flights_1.default);
app.use('/api/bookings', bookings_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running ✅', timestamp: new Date() });
});
// Error Handler
app.use(auth_2.errorHandler);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Start Server
app.listen(PORT, () => {
    console.log('\n🚀 Flight Booking System Server Started');
    console.log(`   Port: ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Frontend: ${process.env.FRONTEND_URL}`);
    console.log('\n📝 API Endpoints:');
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   Flights: http://localhost:${PORT}/api/flights`);
    console.log(`   Bookings: http://localhost:${PORT}/api/bookings`);
    console.log('\n');
});
exports.default = app;
//# sourceMappingURL=server.js.map