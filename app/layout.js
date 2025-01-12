import { Inter } from 'next/font/google';

import './globals.css';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'NextJS 14 Server Actions + Firebase + ui/shadcn - Boilerplate',
    description: 'Made by Abelarde, Adrian Angelo and Dzelle Faith Tan',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
            {/* <Footer /> */}
        </html>
    );
}
