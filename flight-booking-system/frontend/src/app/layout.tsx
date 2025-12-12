import './globals.css';
import Navbar from '@/components/Navbar';
import AuthInitializer from '@/components/AuthInitializer';
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
          <AuthInitializer />
          <Navbar />
          <main className="container-page py-6 md:py-8">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
