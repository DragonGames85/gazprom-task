import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import {
  Employee,
  EmployeeStatus,
} from "../employees/entities/employee.entity";

export interface ReportEntry {
  employeeNumber: string;
  fullName: string;
  action: "hired" | "transferred" | "dismissed";
  date: Date;
  department: string;
  position: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async getEmployeeMovementsReport(
    startDate: Date,
    endDate: Date,
  ): Promise<ReportEntry[]> {
    const allEmployees = await this.employeeRepository.find({
      relations: ["department"],
      order: { hireDate: "ASC" },
    });

    const report: ReportEntry[] = [];
    const processedEntries = new Set<string>();

    const addEntry = (entry: ReportEntry) => {
      const key = `${entry.employeeNumber}-${entry.date.getTime()}-${entry.action}`;
      if (!processedEntries.has(key)) {
        processedEntries.add(key);
        report.push(entry);
      }
    };

    for (const employee of allEmployees) {
      const hireDate = new Date(employee.hireDate);
      const dismissalDate = employee.dismissalDate
        ? new Date(employee.dismissalDate)
        : null;
      const updatedAt = employee.updatedAt
        ? new Date(employee.updatedAt)
        : null;

      const departmentName = employee.department?.fullName || "Не указано";

      if (hireDate >= startDate && hireDate <= endDate) {
        const isTransfer =
          employee.status === EmployeeStatus.TRANSFERRED &&
          updatedAt &&
          updatedAt > hireDate &&
          Math.abs(updatedAt.getTime() - hireDate.getTime()) > 86400000;

        if (
          isTransfer &&
          updatedAt &&
          updatedAt >= startDate &&
          updatedAt <= endDate
        ) {
          addEntry({
            employeeNumber: employee.employeeNumber,
            fullName: employee.fullName,
            action: "transferred",
            date: updatedAt,
            department: departmentName,
            position: employee.position,
          });
        } else {
          addEntry({
            employeeNumber: employee.employeeNumber,
            fullName: employee.fullName,
            action: "hired",
            date: hireDate,
            department: departmentName,
            position: employee.position,
          });
        }
      }

      if (
        employee.status === EmployeeStatus.TRANSFERRED &&
        updatedAt &&
        updatedAt >= startDate &&
        updatedAt <= endDate
      ) {
        const isTransferInPeriod =
          updatedAt > hireDate &&
          Math.abs(updatedAt.getTime() - hireDate.getTime()) > 86400000;
        const isHireNotInPeriod = hireDate < startDate || hireDate > endDate;

        if (isTransferInPeriod && isHireNotInPeriod) {
          addEntry({
            employeeNumber: employee.employeeNumber,
            fullName: employee.fullName,
            action: "transferred",
            date: updatedAt,
            department: departmentName,
            position: employee.position,
          });
        }
      }

      if (
        dismissalDate &&
        dismissalDate >= startDate &&
        dismissalDate <= endDate
      ) {
        addEntry({
          employeeNumber: employee.employeeNumber,
          fullName: employee.fullName,
          action: "dismissed",
          date: dismissalDate,
          department: departmentName,
          position: employee.position,
        });
      }
    }

    return report.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
