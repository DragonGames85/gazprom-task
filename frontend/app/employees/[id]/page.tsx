'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { employeesApi, Employee } from '@/lib/api';

export default function EmployeeDetailPage() {
    const params = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadEmployee();
        }
    }, [params.id]);

    const loadEmployee = async () => {
        try {
            const employeeId = Array.isArray(params.id) ? params.id[0] : params.id;
            const id = Number(employeeId);

            if (isNaN(id)) {
                console.error('Invalid employee ID:', params.id);
                setLoading(false);
                return;
            }

            const response = await employeesApi.getById(id);
            setEmployee(response.data);
        } catch (error: any) {
            console.error('Error loading employee:', error);
            if (error.response?.status === 404) {
                console.error('Employee not found with id:', params.id);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="text-neon-cyan text-2xl">Загрузка...</div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="text-red-400 text-2xl">Сотрудник не найден</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg p-8">
            <div className="container mx-auto max-w-4xl">
                <Link
                    href="/employees"
                    className="text-neon-pink hover:text-neon-cyan transition-colors mb-4 inline-block"
                >
                    ← Назад к списку сотрудников
                </Link>

                <div className="bg-dark-card border-2 border-neon-pink rounded-lg p-8">
                    <div className="flex items-start gap-8 mb-8">
                        <div className="w-32 h-32 rounded-full bg-dark-bg border-4 border-neon-pink flex items-center justify-center text-5xl flex-shrink-0">
                            {employee.photo ? (
                                <img
                                    src={employee.photo}
                                    alt={employee.fullName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span>{employee.gender === 'M' ? '👨' : '👩'}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-neon-pink mb-2">{employee.fullName}</h1>
                            <p className="text-gray-400 text-lg mb-4">Табельный номер: #{employee.employeeNumber}</p>
                            <div className="flex gap-4 text-sm">
                                <div className="bg-dark-bg px-4 py-2 rounded border border-neon-pink">
                                    <span className="text-gray-400">Возраст: </span>
                                    <span className="text-neon-cyan font-bold">{employee.age} лет</span>
                                </div>
                                <div className="bg-dark-bg px-4 py-2 rounded border border-neon-pink">
                                    <span className="text-gray-400">Стаж работы: </span>
                                    <span className="text-neon-green font-bold">{employee.yearsOfWork} лет</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm">Пол</label>
                                <p className="text-white text-lg">{employee.gender === 'M' ? 'Мужской' : 'Женский'}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Дата рождения</label>
                                <p className="text-white text-lg">
                                    {new Date(employee.birthDate).toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Дата приема</label>
                                <p className="text-white text-lg">
                                    {new Date(employee.hireDate).toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                            {employee.dismissalDate && (
                                <div>
                                    <label className="text-gray-400 text-sm">Дата увольнения</label>
                                    <p className="text-red-400 text-lg">
                                        {new Date(employee.dismissalDate).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm">Подразделение</label>
                                <p className="text-white text-lg">{employee.department?.fullName || 'Не указано'}</p>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm">Должность</label>
                                <p className="text-white text-lg">{employee.position}</p>
                            </div>
                            {employee.phone && (
                                <div>
                                    <label className="text-gray-400 text-sm">Телефон</label>
                                    <p className="text-white text-lg">{employee.phone}</p>
                                </div>
                            )}
                            {employee.email && (
                                <div>
                                    <label className="text-gray-400 text-sm">Email</label>
                                    <p className="text-white text-lg">{employee.email}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-gray-400 text-sm">Статус</label>
                                <p
                                    className={`text-lg font-bold ${
                                        employee.status === 'active'
                                            ? 'text-neon-green'
                                            : employee.status === 'transferred'
                                              ? 'text-neon-cyan'
                                              : 'text-red-400'
                                    }`}
                                >
                                    {employee.status === 'active'
                                        ? 'Активен'
                                        : employee.status === 'transferred'
                                          ? 'Переведен'
                                          : 'Уволен'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
