import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee, EmployeeStatus } from "./entities/employee.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { DepartmentsService } from "../departments/departments.service";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private departmentsService: DepartmentsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const department = await this.departmentsService.findOne(
      createEmployeeDto.departmentId,
    );

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      birthDate: new Date(createEmployeeDto.birthDate),
      hireDate: new Date(createEmployeeDto.hireDate),
      dismissalDate: createEmployeeDto.dismissalDate
        ? new Date(createEmployeeDto.dismissalDate)
        : null,
      department,
      status: createEmployeeDto.status || EmployeeStatus.ACTIVE,
    });

    return this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      relations: ["department"],
      order: { employeeNumber: "ASC" },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ["department"],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    if (updateEmployeeDto.departmentId) {
      const department = await this.departmentsService.findOne(
        updateEmployeeDto.departmentId,
      );
      employee.department = department;
    }

    Object.assign(employee, {
      ...updateEmployeeDto,
      birthDate: updateEmployeeDto.birthDate
        ? new Date(updateEmployeeDto.birthDate)
        : employee.birthDate,
      hireDate: updateEmployeeDto.hireDate
        ? new Date(updateEmployeeDto.hireDate)
        : employee.hireDate,
      dismissalDate: updateEmployeeDto.dismissalDate
        ? new Date(updateEmployeeDto.dismissalDate)
        : employee.dismissalDate,
    });

    return this.employeeRepository.save(employee);
  }

  async hire(
    employeeId: number,
    departmentId: number,
    hireDate?: Date,
  ): Promise<Employee> {
    const employee = await this.findOne(employeeId);
    const department = await this.departmentsService.findOne(departmentId);

    employee.department = department;
    employee.hireDate = hireDate || new Date();
    employee.dismissalDate = null;
    employee.status = EmployeeStatus.ACTIVE;

    return this.employeeRepository.save(employee);
  }

  async transfer(
    employeeId: number,
    newDepartmentId: number,
    transferDate?: Date,
  ): Promise<Employee> {
    const employee = await this.findOne(employeeId);
    const newDepartment =
      await this.departmentsService.findOne(newDepartmentId);

    employee.department = newDepartment;
    employee.status = EmployeeStatus.TRANSFERRED;

    const saved = await this.employeeRepository.save(employee);

    if (transferDate) {
      saved.updatedAt = transferDate;
      return this.employeeRepository.save(saved);
    }

    return saved;
  }

  async dismiss(employeeId: number, dismissalDate?: Date): Promise<Employee> {
    const employee = await this.findOne(employeeId);
    employee.dismissalDate = dismissalDate || new Date();
    employee.status = EmployeeStatus.DISMISSED;

    return this.employeeRepository.save(employee);
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  calculateYearsOfWork(hireDate: Date, dismissalDate?: Date): number {
    const endDate = dismissalDate || new Date();
    let years = endDate.getFullYear() - hireDate.getFullYear();
    const monthDiff = endDate.getMonth() - hireDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && endDate.getDate() < hireDate.getDate())
    ) {
      years--;
    }
    return years;
  }
}
