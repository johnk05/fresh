import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fresh - Kerala Backyard Harvest',
  description: 'Connect with tree owners and contractors for the perfect mango harvest.',
  manifest: '/manifest.json',
  themeColor: '#FDB714',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}