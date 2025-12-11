import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "./entities/department.entity";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      creationDate: createDepartmentDto.creationDate
        ? new Date(createDepartmentDto.creationDate)
        : new Date(),
      liquidationDate: createDepartmentDto.liquidationDate
        ? new Date(createDepartmentDto.liquidationDate)
        : null,
    });

    if (createDepartmentDto.parentId) {
      const parent = await this.findOne(createDepartmentDto.parentId);
      department.parent = parent;
    }

    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: ["parent", "children"],
      order: { code: "ASC" },
    });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ["parent", "children", "employees"],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    Object.assign(department, {
      ...updateDepartmentDto,
      creationDate: updateDepartmentDto.creationDate
        ? new Date(updateDepartmentDto.creationDate)
        : department.creationDate,
      liquidationDate: updateDepartmentDto.liquidationDate
        ? new Date(updateDepartmentDto.liquidationDate)
        : department.liquidationDate,
    });

    if (updateDepartmentDto.parentId !== undefined) {
      if (updateDepartmentDto.parentId) {
        const parent = await this.findOne(updateDepartmentDto.parentId);
        department.parent = parent;
      } else {
        department.parent = null;
      }
    }

    return this.departmentRepository.save(department);
  }

  async liquidate(id: number, liquidationDate?: Date): Promise<Department> {
    const department = await this.findOne(id);
    department.liquidationDate = liquidationDate || new Date();
    return this.departmentRepository.save(department);
  }

  async getHierarchy(): Promise<Department[]> {
    const allDepartments = await this.departmentRepository.find({
      relations: ["parent", "children"],
      order: { code: "ASC" },
    });

    return allDepartments.filter((dept) => !dept.parent);
  }
}
