import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

// Grance font fallback - Using Playfair Display as fallback until Grance font files are added
// Once you add Grance font files to frontend/public/fonts/, update globals.css @font-face declarations
// The actual Grance font will take priority over this fallback
const grance = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-grance',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Shree Omji Saraf - Gold & Silver Purchase Platform',
  description: 'Shree Omji Saraf has been a beacon of elegance and craftsmanship for years, specializing in exquisite gold and diamond pieces that exude luxury and timeless beauty. With a legacy steeped in tradition and artistry, our collections are a testament to the rich cultural heritage of India.',
  keywords: ['gold', 'silver', 'precious metals', 'investment', 'India', 'jewelry', 'Shree Omji Saraf', 'diamonds'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${grance.variable} font-grance`}>
        {children}
        <Toaster position="top-right" richColors expand={true} duration={5000} />
      </body>
    </html>
  );
}
