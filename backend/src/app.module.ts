import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DepartmentsModule } from "./departments/departments.module";
import { EmployeesModule } from "./employees/employees.module";
import { ReportsModule } from "./reports/reports.module";
import { Department } from "./departments/entities/department.entity";
import { Employee } from "./employees/entities/employee.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "postgres"),
        database: configService.get("DB_NAME", "gazprom_db"),
        entities: [Department, Employee],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    DepartmentsModule,
    EmployeesModule,
    ReportsModule,
  ],
})
export class AppModule {}
