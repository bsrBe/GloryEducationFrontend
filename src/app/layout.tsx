import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['600', '700'],
});

export const metadata: Metadata = {
  title: 'Glory International Admissions Fair',
  description: 'Find out where your academic profile can realistically take you',
  icons: {
    icon: [
      { url: '/IMG_1746.png', sizes: '32x32', type: 'image/png' },
      { url: '/IMG_1746.png', sizes: '48x48', type: 'image/png' },
      { url: '/IMG_1746.png', sizes: '96x96', type: 'image/png' },
      { url: '/IMG_1746.png', sizes: '192x192', type: 'image/png' },
      { url: '/IMG_1746.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/IMG_1746.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/IMG_1746.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-porcelain text-carbon antialiased">
        {children}
      </body>
    </html>
  );
}
