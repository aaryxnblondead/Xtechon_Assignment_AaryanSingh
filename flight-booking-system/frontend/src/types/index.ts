export type Flight = {
  flightId: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  basePrice: number;
  currentPrice: number;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  seatsAvailable: number;
  totalSeats: number;
  isSurged?: boolean;
};

export type Booking = {
  _id: string;
  pnr: string;
  finalPrice: number;
  passengerName: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
  flightDetails: {
    airline: string;
    flightId: string;
    departureCity: string;
    arrivalCity: string;
    departureTime: string;
  };
};
