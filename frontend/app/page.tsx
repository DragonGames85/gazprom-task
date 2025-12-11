'use client';

import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold text-neon-cyan mb-4">Employee Management System</h1>
                    <p className="text-xl text-gray-400">Система управления сотрудниками компании</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <Link
                        href="/departments"
                        className="group relative bg-dark-card border-2 border-neon-cyan rounded-lg p-8 hover:shadow-neon-cyan transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-4xl mb-4 text-neon-cyan">🏢</div>
                        <h2 className="text-2xl font-bold text-neon-cyan mb-2">Подразделения</h2>
                        <p className="text-gray-400">Управление структурными подразделениями компании</p>
                    </Link>

                    <Link
                        href="/employees"
                        className="group relative bg-dark-card border-2 border-neon-pink rounded-lg p-8 hover:shadow-neon-pink transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-4xl mb-4 text-neon-pink">👥</div>
                        <h2 className="text-2xl font-bold text-neon-pink mb-2">Сотрудники</h2>
                        <p className="text-gray-400">Просмотр и управление информацией о сотрудниках</p>
                    </Link>

                    <Link
                        href="/reports"
                        className="group relative bg-dark-card border-2 border-neon-green rounded-lg p-8 hover:shadow-neon-green transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-4xl mb-4 text-neon-green">📊</div>
                        <h2 className="text-2xl font-bold text-neon-green mb-2">Отчеты</h2>
                        <p className="text-gray-400">Формирование отчетов по движению сотрудников</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
