import './globals.css';
import { Inter } from 'next/font/google';
import ToastContainer from '../components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: {
    default: 'RoutineOS',
    template: '%s · RoutineOS',
  },
  description: 'The routine that adapts to your real life. Build habits that survive real life — smart recovery, adaptive modes, AI insights.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/Routine logo1.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/Routine logo1.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/Routine logo1.png',
    apple: '/icons/Routine logo1.png',
  },
  appleWebApp: {
    capable: true,
    title: 'RoutineOS',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport = {
  themeColor: '#6C47FF',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}