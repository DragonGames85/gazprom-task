'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { departmentsApi, Department, CreateDepartmentDto } from '@/lib/api';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [formData, setFormData] = useState<CreateDepartmentDto>({
        code: '',
        fullName: '',
        abbreviation: '',
        creationDate: '',
        parentId: undefined,
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await departmentsApi.getAll();
            setDepartments(response.data);
        } catch (error) {
            console.error('Error loading departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await departmentsApi.update(editingDept.id, formData);
            } else {
                await departmentsApi.create(formData);
            }
            setShowModal(false);
            setEditingDept(null);
            setFormData({
                code: '',
                fullName: '',
                abbreviation: '',
                creationDate: '',
                parentId: undefined,
            });
            loadDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
            alert('Ошибка при сохранении подразделения');
        }
    };

    const handleEdit = (dept: Department) => {
        setEditingDept(dept);
        setFormData({
            code: dept.code,
            fullName: dept.fullName,
            abbreviation: dept.abbreviation,
            creationDate: dept.creationDate || '',
            liquidationDate: dept.liquidationDate || '',
            parentId: dept.parentId || undefined,
        });
        setShowModal(true);
    };

    const handleLiquidate = async (id: number) => {
        if (confirm('Вы уверены, что хотите ликвидировать это подразделение?')) {
            try {
                await departmentsApi.liquidate(id);
                loadDepartments();
            } catch (error) {
                console.error('Error liquidating department:', error);
                alert('Ошибка при ликвидации подразделения');
            }
        }
    };

    const getParentName = (parentId: number | null) => {
        if (!parentId) return null;
        const parent = departments.find(d => d.id === parentId);
        return parent?.fullName || null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="text-neon-cyan text-2xl">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg p-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link
                            href="/"
                            className="text-neon-cyan hover:text-neon-pink transition-colors mb-4 inline-block"
                        >
                            ← На главную
                        </Link>
                        <h1 className="text-4xl font-bold text-neon-cyan">Подразделения</h1>
                    </div>
                    <button
                        onClick={() => {
                            setEditingDept(null);
                            setFormData({
                                code: '',
                                fullName: '',
                                abbreviation: '',
                                creationDate: '',
                                parentId: undefined,
                            });
                            setShowModal(true);
                        }}
                        className="bg-neon-cyan text-dark-bg px-6 py-3 rounded-lg font-bold hover:shadow-neon-cyan transition-all"
                    >
                        + Добавить подразделение
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map(dept => (
                        <div
                            key={dept.id}
                            className={`bg-dark-card border-2 rounded-lg p-6 ${
                                dept.liquidationDate
                                    ? 'border-gray-600 opacity-60'
                                    : 'border-neon-cyan hover:shadow-neon-cyan'
                            } transition-all`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-neon-cyan mb-1">
                                        {dept.code} - {dept.abbreviation}
                                    </h3>
                                    <p className="text-gray-300">{dept.fullName}</p>
                                </div>
                                {dept.liquidationDate && <span className="text-red-400 text-sm">Ликвидировано</span>}
                            </div>

                            <div className="text-sm text-gray-400 mb-4 space-y-1">
                                <p>
                                    Создано:{' '}
                                    {dept.creationDate
                                        ? new Date(dept.creationDate).toLocaleDateString('ru-RU')
                                        : 'Не указано'}
                                </p>
                                {dept.liquidationDate && (
                                    <p>Ликвидировано: {new Date(dept.liquidationDate).toLocaleDateString('ru-RU')}</p>
                                )}
                                {dept.parentId && <p>Родитель: {getParentName(dept.parentId)}</p>}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="flex-1 bg-neon-pink text-white px-4 py-2 rounded hover:shadow-neon-pink transition-all"
                                >
                                    Редактировать
                                </button>
                                {!dept.liquidationDate && (
                                    <button
                                        onClick={() => handleLiquidate(dept.id)}
                                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
                                    >
                                        Ликвидировать
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-dark-card border-2 border-neon-cyan rounded-lg p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-neon-cyan mb-6">
                                {editingDept ? 'Редактировать' : 'Создать'} подразделение
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">Код (4 символа)</label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        required
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-dark-bg border border-neon-cyan rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Полное наименование</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-dark-bg border border-neon-cyan rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Аббревиатура</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.abbreviation}
                                        onChange={e => setFormData({ ...formData, abbreviation: e.target.value })}
                                        className="w-full bg-dark-bg border border-neon-cyan rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Дата создания</label>
                                    <input
                                        type="date"
                                        value={formData.creationDate}
                                        onChange={e => setFormData({ ...formData, creationDate: e.target.value })}
                                        className="w-full bg-dark-bg border border-neon-cyan rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Родительское подразделение</label>
                                    <select
                                        value={formData.parentId || ''}
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                parentId: e.target.value ? Number(e.target.value) : undefined,
                                            })
                                        }
                                        className="w-full bg-dark-bg border border-neon-cyan rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                                    >
                                        <option value="">Нет</option>
                                        {departments
                                            .filter(d => !d.liquidationDate && d.id !== editingDept?.id)
                                            .map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.code} - {d.fullName}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-neon-cyan text-dark-bg px-6 py-3 rounded-lg font-bold hover:shadow-neon-cyan transition-all"
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingDept(null);
                                        }}
                                        className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-all"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
