'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { employeesApi, departmentsApi, Employee, Department, CreateEmployeeDto } from '@/lib/api';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState<CreateEmployeeDto>({
        employeeNumber: '',
        fullName: '',
        gender: 'M',
        birthDate: '',
        hireDate: '',
        departmentId: 0,
        position: '',
        phone: '',
        email: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [employeesRes, departmentsRes] = await Promise.all([employeesApi.getAll(), departmentsApi.getAll()]);
            setEmployees(employeesRes.data);
            setDepartments(departmentsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingEmployee) {
                await employeesApi.update(editingEmployee.id, formData);
            } else {
                await employeesApi.create(formData);
            }
            setShowModal(false);
            setEditingEmployee(null);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Ошибка при сохранении сотрудника');
        }
    };

    const resetForm = () => {
        setFormData({
            employeeNumber: '',
            fullName: '',
            gender: 'M',
            birthDate: '',
            hireDate: '',
            departmentId: 0,
            position: '',
            phone: '',
            email: '',
        });
    };

    const handleEdit = async (id: number) => {
        const formatDate = (date: string | Date | null | undefined): string => {
            if (!date) return '';
            if (typeof date === 'string') {
                return date.split('T')[0];
            }
            if (date instanceof Date) {
                return date.toISOString().split('T')[0];
            }
            return '';
        };

        try {
            const response = await employeesApi.getById(id);
            const emp = response.data;
            setEditingEmployee(emp);

            setFormData({
                employeeNumber: emp.employeeNumber,
                fullName: emp.fullName,
                gender: emp.gender,
                birthDate: formatDate(emp.birthDate),
                hireDate: formatDate(emp.hireDate),
                dismissalDate: emp.dismissalDate ? formatDate(emp.dismissalDate) : undefined,
                departmentId: emp.departmentId,
                position: emp.position,
                phone: emp.phone || '',
                email: emp.email || '',
                photo: emp.photo || '',
            });
            setShowModal(true);
        } catch (error: any) {
            console.error('Error loading employee:', error);
            const empFromList = employees.find(e => e.id === id);
            if (empFromList) {
                setEditingEmployee(empFromList);
                setFormData({
                    employeeNumber: empFromList.employeeNumber,
                    fullName: empFromList.fullName,
                    gender: empFromList.gender,
                    birthDate: formatDate(empFromList.birthDate),
                    hireDate: formatDate(empFromList.hireDate),
                    dismissalDate: empFromList.dismissalDate ? formatDate(empFromList.dismissalDate) : undefined,
                    departmentId: empFromList.departmentId,
                    position: empFromList.position,
                    phone: empFromList.phone || '',
                    email: empFromList.email || '',
                    photo: empFromList.photo || '',
                });
                setShowModal(true);
            } else {
                alert(`Ошибка при загрузке данных сотрудника: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleAction = async (action: 'hire' | 'transfer' | 'dismiss', id: number) => {
        try {
            if (action === 'dismiss') {
                if (confirm('Вы уверены, что хотите уволить этого сотрудника?')) {
                    await employeesApi.dismiss(id);
                    loadData();
                }
            } else if (action === 'transfer') {
                const newDeptId = prompt('Введите ID нового подразделения:');
                if (newDeptId) {
                    await employeesApi.transfer(id, Number(newDeptId));
                    loadData();
                }
            } else if (action === 'hire') {
                const deptId = prompt('Введите ID подразделения:');
                if (deptId) {
                    await employeesApi.hire(id, Number(deptId));
                    loadData();
                }
            }
        } catch (error) {
            console.error(`Error ${action} employee:`, error);
            alert(`Ошибка при выполнении действия`);
        }
    };

    const getDepartmentName = (deptId: number) => {
        const dept = departments.find(d => d.id === deptId);
        return dept?.fullName || 'Неизвестно';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-neon-green';
            case 'transferred':
                return 'text-neon-cyan';
            case 'dismissed':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Активен';
            case 'transferred':
                return 'Переведен';
            case 'dismissed':
                return 'Уволен';
            default:
                return status;
        }
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
                        <h1 className="text-4xl font-bold text-neon-pink">Сотрудники</h1>
                    </div>
                    <button
                        onClick={() => {
                            setEditingEmployee(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-neon-pink text-dark-bg px-6 py-3 rounded-lg font-bold hover:shadow-neon-pink transition-all"
                    >
                        + Добавить сотрудника
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees.map(emp => (
                        <div
                            key={emp.id}
                            className="bg-dark-card border-2 border-neon-pink rounded-lg p-6 hover:shadow-neon-pink transition-all"
                        >
                            <Link href={`/employees/${emp.id}`} onClick={e => e.stopPropagation()}>
                                <div className="flex items-center gap-4 mb-4 cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-dark-bg border-2 border-neon-pink flex items-center justify-center text-2xl">
                                        {emp.photo ? (
                                            <img
                                                src={emp.photo}
                                                alt={emp.fullName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span>{emp.gender === 'M' ? '👨' : '👩'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-neon-pink mb-1 hover:text-neon-cyan transition-colors">
                                            {emp.fullName}
                                        </h3>
                                        <p className="text-gray-400 text-sm">#{emp.employeeNumber}</p>
                                    </div>
                                </div>
                            </Link>

                            <div className="space-y-2 text-sm text-gray-300 mb-4">
                                <p>Должность: {emp.position}</p>
                                <p>Подразделение: {getDepartmentName(emp.departmentId)}</p>
                                <p className={getStatusColor(emp.status)}>Статус: {getStatusText(emp.status)}</p>
                            </div>

                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEdit(emp.id);
                                    }}
                                    className="flex-1 bg-neon-cyan text-dark-bg px-4 py-2 rounded hover:shadow-neon-cyan transition-all"
                                >
                                    Редактировать
                                </button>
                                {emp.status === 'active' && (
                                    <button
                                        onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAction('dismiss', emp.id);
                                        }}
                                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
                                    >
                                        Уволить
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                        onClick={e => {
                            if (e.target === e.currentTarget) {
                                setShowModal(false);
                                setEditingEmployee(null);
                            }
                        }}
                    >
                        <div
                            className="bg-dark-card border-2 border-neon-pink rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-neon-pink mb-6">
                                {editingEmployee ? 'Редактировать' : 'Создать'} сотрудника
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Табельный номер</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.employeeNumber}
                                            onChange={e => setFormData({ ...formData, employeeNumber: e.target.value })}
                                            className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">ФИО</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Пол</label>
                                        <select
                                            value={formData.gender}
                                            onChange={e =>
                                                setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })
                                            }
                                            className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                        >
                                            <option value="M">Мужской</option>
                                            <option value="F">Женский</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Дата рождения</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.birthDate}
                                            onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                            className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Дата приема</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.hireDate}
                                            onChange={e => setFormData({ ...formData, hireDate: e.target.value })}
                                            className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Подразделение</label>
                                        <select
                                            required
                                            value={formData.departmentId}
                                            onChange={e =>
                                                setFormData({ ...formData, departmentId: Number(e.target.value) })
                                            }
                                            className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                        >
                                            <option value={0}>Выберите подразделение</option>
                                            {departments
                                                .filter(d => !d.liquidationDate)
                                                .map(d => (
                                                    <option key={d.id} value={d.id}>
                                                        {d.code} - {d.fullName}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Должность</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Телефон</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Фото (URL)</label>
                                    <input
                                        type="url"
                                        value={formData.photo || ''}
                                        onChange={e => setFormData({ ...formData, photo: e.target.value })}
                                        className="w-full bg-dark-bg border border-neon-pink rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-neon-pink text-dark-bg px-6 py-3 rounded-lg font-bold hover:shadow-neon-pink transition-all"
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingEmployee(null);
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
