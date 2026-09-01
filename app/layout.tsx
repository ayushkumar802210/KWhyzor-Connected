import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KWhyzor — India’s Intelligent Electricity Bill Understanding Platform',
  description: 'Upload your real electricity bill and KWhyzor will extract, verify and explain the information available in your document.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
