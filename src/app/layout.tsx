import './globals.css';
// Import keep-react CSS after our globals to ensure proper cascade
import 'keep-react/css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Permisoria',
  description: 'Permit Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background min-h-screen">
        {children}
      </body>
    </html>
  );
} 