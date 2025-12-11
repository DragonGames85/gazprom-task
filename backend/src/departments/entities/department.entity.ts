import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Employee } from "../../employees/entities/employee.entity";

@Entity("departments")
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 4, unique: true })
  code: string;

  @Column({ type: "varchar", length: 255 })
  fullName: string;

  @Column({ type: "varchar", length: 50 })
  abbreviation: string;

  @Column({ type: "date", nullable: true })
  creationDate: Date;

  @Column({ type: "date", nullable: true })
  liquidationDate: Date;

  @ManyToOne(() => Department, (department) => department.children, {
    nullable: true,
  })
  parent: Department;

  @Column({ nullable: true })
  parentId: number;

  @OneToMany(() => Department, (department) => department.parent)
  children: Department[];

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
