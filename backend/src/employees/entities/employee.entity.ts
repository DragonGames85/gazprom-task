import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Department } from "../../departments/entities/department.entity";

export enum Gender {
  MALE = "M",
  FEMALE = "F",
}

export enum EmployeeStatus {
  ACTIVE = "active",
  TRANSFERRED = "transferred",
  DISMISSED = "dismissed",
}

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  employeeNumber: string;

  @Column({ type: "varchar", length: 255 })
  fullName: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column({ type: "date" })
  birthDate: Date;

  @Column({ type: "date" })
  hireDate: Date;

  @Column({ type: "date", nullable: true })
  dismissalDate: Date;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @Column()
  departmentId: number;

  @Column({ type: "varchar", length: 255 })
  position: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "text", nullable: true })
  photo: string;

  @Column({
    type: "enum",
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
