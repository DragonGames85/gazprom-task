import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  code: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  abbreviation: string;

  @IsOptional()
  @IsDateString()
  creationDate?: string;

  @IsOptional()
  @IsDateString()
  liquidationDate?: string;

  @IsOptional()
  parentId?: number;
}
