import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const employee = await this.employeesService.findOne(id);
    const age = this.employeesService.calculateAge(employee.birthDate);
    const yearsOfWork = this.employeesService.calculateYearsOfWork(
      employee.hireDate,
      employee.dismissalDate,
    );

    return {
      ...employee,
      age,
      yearsOfWork,
    };
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Post(":id/hire")
  hire(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { departmentId: number; hireDate?: string },
  ) {
    return this.employeesService.hire(
      id,
      body.departmentId,
      body.hireDate ? new Date(body.hireDate) : undefined,
    );
  }

  @Post(":id/transfer")
  transfer(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { newDepartmentId: number; transferDate?: string },
  ) {
    return this.employeesService.transfer(
      id,
      body.newDepartmentId,
      body.transferDate ? new Date(body.transferDate) : undefined,
    );
  }

  @Post(":id/dismiss")
  dismiss(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { dismissalDate?: string },
  ) {
    return this.employeesService.dismiss(
      id,
      body.dismissalDate ? new Date(body.dismissalDate) : undefined,
    );
  }
}
