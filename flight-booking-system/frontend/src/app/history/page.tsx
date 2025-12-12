"use client";
import { useEffect, useState } from "react";
import { getBookingHistory } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { Booking } from "@/types";
import toast from "react-hot-toast";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        toast.error("You must be logged in to view your booking history.");
        setLoading(false);
        return;
      }
      try {
        const history = await getBookingHistory(token);
        setBookings(history);
      } catch (error) {
        toast.error("Failed to fetch booking history.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const handleRedownload = (pnr: string) => {
    // In a real app, you'd call an API endpoint to get the PDF
    toast.success(`Downloading ticket for PNR: ${pnr}`);
  };

  if (loading) {
    return <p>Loading booking history...</p>;
  }

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg">PNR: {booking.pnr}</p>
                <p>
                  {booking.flight.departureCity} to{" "}
                  {booking.flight.arrivalCity}
                </p>
                <p>
                  {new Date(booking.flight.departureTime).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleRedownload(booking.pnr)}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Re-download Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
