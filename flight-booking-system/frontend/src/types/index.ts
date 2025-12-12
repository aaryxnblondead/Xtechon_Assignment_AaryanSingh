export interface Flight {
  _id: string;
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
}

export interface Booking {
  _id: string;
  pnr: string;
  passengerName: string;
  finalPrice: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
  flightDetails: {
    airline: string;
    flightId: string;
    departureCity: string;
    arrivalCity: string;
    departureTime: string;
  };
  ticketDownloadUrl: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  walletBalance: number;
}
