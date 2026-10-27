import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'PORTAL.AI',
  description: 'Next-Gen Assistance platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='h-full bg-background text-foreground'>
      <head />
      <body className='h-full flex flex-col'>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
