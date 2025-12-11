import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsInt,
  IsEmail,
} from "class-validator";
import { Gender, EmployeeStatus } from "../entities/employee.entity";

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  birthDate: string;

  @IsDateString()
  hireDate: string;

  @IsOptional()
  @IsDateString()
  dismissalDate?: string;

  @IsInt()
  departmentId: number;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}
