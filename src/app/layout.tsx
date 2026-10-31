import type { Metadata } from 'next';
import { Red_Hat_Display, Red_Hat_Text } from 'next/font/google';
import './globals.css';

const redHatText = Red_Hat_Text({
  variable: '--font-red-hat-text',
  subsets: ['latin'],
});

const redHatDisplay = Red_Hat_Display({
  variable: '--font-red-hat-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Veridan Education | Meet universities abroad, live online',
  description:
    'Veridan Education connects African students with universities abroad through live webinars. Registration is open to every student.',
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: [{ url: '/brand/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${redHatText.variable} ${redHatDisplay.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-porcelain text-carbon antialiased">
        {children}
      </body>
    </html>
  );
}
