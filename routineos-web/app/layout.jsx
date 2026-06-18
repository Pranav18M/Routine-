import './globals.css';
import '../styles/animations.css';
import { Inter } from 'next/font/google';
import ToastContainer from '../components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'RoutineOS — The routine that adapts to your real life',
  description: 'Build habits that survive real life. Smart recovery, adaptive modes, AI insights.',
  manifest: '/manifest.json',
  themeColor: '#6C47FF',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    title: 'RoutineOS',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="font-sans antialiased">
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}