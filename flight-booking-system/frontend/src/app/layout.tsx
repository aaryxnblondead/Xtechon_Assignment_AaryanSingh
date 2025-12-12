import './globals.css';
import Navbar from '@/components/Navbar';
import { StoreProvider } from '@/store';

export const metadata = {
  title: 'Flight Booking',
  description: 'Flight Booking System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
