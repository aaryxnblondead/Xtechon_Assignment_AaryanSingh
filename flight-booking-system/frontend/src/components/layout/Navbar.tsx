"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { token, logout } = useAuthStore();
  const { balance, fetchBalance } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchBalance();
    }
  }, [token, fetchBalance]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          FlightBook
        </Link>
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <span className="text-gray-700">
                Wallet: ₹{balance.toFixed(2)}
              </span>
              <Link
                href="/history"
                className="text-gray-700 hover:text-indigo-600"
              >
                Booking History
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;