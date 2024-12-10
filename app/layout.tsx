import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'DMP Marketplace',
    description: 'A marketplace for DMP spots in stores',
};

// Add use client directive
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap children with AuthProvider */}
        <AuthProvider >{children}</AuthProvider>
      </body>
    </html>
  );
}
