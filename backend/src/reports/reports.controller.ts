import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { ReportsService } from "./reports.service";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("employee-movements")
  getEmployeeMovementsReport(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException("startDate and endDate are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException("Invalid date format");
    }

    if (start > end) {
      throw new BadRequestException("startDate must be before endDate");
    }

    return this.reportsService.getEmployeeMovementsReport(start, end);
  }
}
