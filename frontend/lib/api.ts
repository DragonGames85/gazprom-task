import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Department {
    id: number;
    code: string;
    fullName: string;
    abbreviation: string;
    creationDate: string | null;
    liquidationDate: string | null;
    parentId: number | null;
    parent?: Department;
    children?: Department[];
}

export interface Employee {
    id: number;
    employeeNumber: string;
    fullName: string;
    gender: 'M' | 'F';
    birthDate: string;
    hireDate: string;
    dismissalDate: string | null;
    departmentId: number;
    department?: Department;
    position: string;
    phone: string | null;
    email: string | null;
    photo: string | null;
    status: 'active' | 'transferred' | 'dismissed';
    age?: number;
    yearsOfWork?: number;
}

export interface CreateDepartmentDto {
    code: string;
    fullName: string;
    abbreviation: string;
    creationDate?: string;
    liquidationDate?: string;
    parentId?: number;
}

export interface CreateEmployeeDto {
    employeeNumber: string;
    fullName: string;
    gender: 'M' | 'F';
    birthDate: string;
    hireDate: string;
    dismissalDate?: string;
    departmentId: number;
    position: string;
    phone?: string;
    email?: string;
    photo?: string;
    status?: 'active' | 'transferred' | 'dismissed';
}

export const departmentsApi = {
    getAll: () => api.get<Department[]>('/departments'),
    getHierarchy: () => api.get<Department[]>('/departments/hierarchy'),
    getById: (id: number) => api.get<Department>(`/departments/${id}`),
    create: (data: CreateDepartmentDto) => api.post<Department>('/departments', data),
    update: (id: number, data: Partial<CreateDepartmentDto>) => api.patch<Department>(`/departments/${id}`, data),
    liquidate: (id: number) => api.post<Department>(`/departments/${id}/liquidate`),
};

export const employeesApi = {
    getAll: () => api.get<Employee[]>('/employees'),
    getById: (id: number) => {
        return api.get<Employee>(`/employees/${id}`);
    },
    create: (data: CreateEmployeeDto) => api.post<Employee>('/employees', data),
    update: (id: number, data: Partial<CreateEmployeeDto>) => api.patch<Employee>(`/employees/${id}`, data),
    hire: (id: number, departmentId: number, hireDate?: string) =>
        api.post<Employee>(`/employees/${id}/hire`, { departmentId, hireDate }),
    transfer: (id: number, newDepartmentId: number, transferDate?: string) =>
        api.post<Employee>(`/employees/${id}/transfer`, { newDepartmentId, transferDate }),
    dismiss: (id: number, dismissalDate?: string) => api.post<Employee>(`/employees/${id}/dismiss`, { dismissalDate }),
};

export const reportsApi = {
    getEmployeeMovements: (startDate: string, endDate: string) =>
        api.get('/reports/employee-movements', {
            params: { startDate, endDate },
        }),
};

export default api;
