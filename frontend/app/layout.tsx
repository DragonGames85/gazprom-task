import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Employee Management System',
    description: 'Система управления сотрудниками компании',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
            <body>{children}</body>
        </html>
    );
}
