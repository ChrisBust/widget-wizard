import type { ReactNode } from 'react';
import '../../globals.css';

export const metadata = {
  title: 'Reviews Widget',
  description: 'An embeddable reviews widget.',
};

export default function WidgetLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-background">{children}</body>
    </html>
  );
}
