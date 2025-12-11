'use client';

import { useState } from 'react';
import Link from 'next/link';
import { reportsApi } from '@/lib/api';
import { format } from 'date-fns';

interface ReportEntry {
    employeeNumber: string;
    fullName: string;
    action: 'hired' | 'transferred' | 'dismissed';
    date: string;
    department: string;
    position: string;
}

export default function ReportsPage() {
    const [startDate, setStartDate] = useState(
        format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd')
    );
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [report, setReport] = useState<ReportEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const generateReport = async () => {
        if (!startDate || !endDate) {
            alert('Пожалуйста, выберите период');
            return;
        }

        setLoading(true);
        try {
            const response = await reportsApi.getEmployeeMovements(startDate, endDate);
            setReport(response.data);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Ошибка при формировании отчета');
        } finally {
            setLoading(false);
        }
    };

    const getActionText = (action: string) => {
        switch (action) {
            case 'hired':
                return 'Принят';
            case 'transferred':
                return 'Переведен';
            case 'dismissed':
                return 'Уволен';
            default:
                return action;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'hired':
                return 'text-neon-green';
            case 'transferred':
                return 'text-neon-cyan';
            case 'dismissed':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg p-8">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-8">
                    <Link href="/" className="text-neon-green hover:text-neon-cyan transition-colors mb-4 inline-block">
                        ← На главную
                    </Link>
                    <h1 className="text-4xl font-bold text-neon-green mb-8">Отчет по движению сотрудников</h1>
                </div>

                <div className="bg-dark-card border-2 border-neon-green rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-gray-300 mb-2">Начало периода</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full bg-dark-bg border border-neon-green rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-green"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Конец периода</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full bg-dark-bg border border-neon-green rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-green"
                            />
                        </div>
                        <button
                            onClick={generateReport}
                            disabled={loading}
                            className="bg-neon-green text-dark-bg px-6 py-2 rounded-lg font-bold hover:shadow-neon-green transition-all disabled:opacity-50"
                        >
                            {loading ? 'Загрузка...' : 'Сформировать отчет'}
                        </button>
                    </div>
                </div>

                {report.length > 0 && (
                    <div className="bg-dark-card border-2 border-neon-green rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-dark-bg">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-neon-green font-bold">Дата</th>
                                        <th className="px-6 py-4 text-left text-neon-green font-bold">
                                            Табельный номер
                                        </th>
                                        <th className="px-6 py-4 text-left text-neon-green font-bold">ФИО</th>
                                        <th className="px-6 py-4 text-left text-neon-green font-bold">Действие</th>
                                        <th className="px-6 py-4 text-left text-neon-green font-bold">Подразделение</th>
                                        <th className="px-6 py-4 text-left text-neon-green font-bold">Должность</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-dark-border hover:bg-dark-bg transition-colors"
                                        >
                                            <td className="px-6 py-4 text-white">
                                                {new Date(entry.date).toLocaleDateString('ru-RU')}
                                            </td>
                                            <td className="px-6 py-4 text-white">#{entry.employeeNumber}</td>
                                            <td className="px-6 py-4 text-white">{entry.fullName}</td>
                                            <td className={`px-6 py-4 font-bold ${getActionColor(entry.action)}`}>
                                                {getActionText(entry.action)}
                                            </td>
                                            <td className="px-6 py-4 text-white">{entry.department}</td>
                                            <td className="px-6 py-4 text-white">{entry.position}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-dark-bg px-6 py-4 text-gray-400 text-sm">Всего записей: {report.length}</div>
                    </div>
                )}

                {report.length === 0 && !loading && (
                    <div className="bg-dark-card border-2 border-neon-green rounded-lg p-8 text-center">
                        <p className="text-gray-400 text-lg">Выберите период и нажмите "Сформировать отчет"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
