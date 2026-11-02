import type { Metadata } from 'next';
import { Red_Hat_Display, Red_Hat_Text } from 'next/font/google';
import { Toaster } from 'sonner';
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
        <Toaster
          position="top-right"
          theme="system"
          richColors
          closeButton
          duration={5000}
          style={
            {
              '--success-bg': 'var(--status-green-bg)',
              '--success-border': 'var(--status-green)',
              '--success-text': 'var(--status-green-text)',
              '--error-bg': 'var(--status-red-bg)',
              '--error-border': 'var(--status-red)',
              '--error-text': 'var(--status-red-text)',
            } as React.CSSProperties
          }
        />
      </body>
    </html>
  );
}
