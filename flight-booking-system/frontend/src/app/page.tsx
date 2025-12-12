"use client";
import { useAuthStore } from "@/store/auth";
import FlightSearch from "@/components/flights/FlightSearch";
import Login from "@/components/auth/Login";

export default function Home() {
  const { token } = useAuthStore();

  return (
    <div className="w-full">
      {token ? <FlightSearch /> : <Login />}
    </div>
  );
}
