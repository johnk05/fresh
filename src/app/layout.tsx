
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fresh - Kerala Backyard Harvest',
  description: 'Connect with tree owners and contractors for the perfect mango harvest.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#FDB714" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
