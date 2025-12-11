import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeesService } from "./employees.service";
import { EmployeesController } from "./employees.controller";
import { Employee } from "./entities/employee.entity";
import { DepartmentsModule } from "../departments/departments.module";

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), DepartmentsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
