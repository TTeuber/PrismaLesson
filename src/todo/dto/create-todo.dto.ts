import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateTodoDto - Data Transfer Object for creating a new todo
 *
 * What is a DTO?
 * - A DTO defines the shape of data for a specific operation
 * - It separates the API contract from the database model
 * - Allows validation before data reaches your service/database
 *
 * Why use class-validator decorators?
 * - @IsString() ensures the value is a string type
 * - @IsNotEmpty() ensures the string is not empty (not just "")
 * - @IsBoolean() ensures the value is true or false
 * - @IsOptional() marks the field as not required
 * - @IsInt() ensures the value is an integer
 * - @IsPositive() ensures the value is a positive number
 *
 * Why use Swagger decorators?
 * - @ApiProperty() documents required fields in Swagger UI
 * - @ApiPropertyOptional() documents optional fields
 * - These generate interactive API documentation automatically
 */
export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the todo item',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Whether the todo is completed',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({
    description: 'The ID of the user this todo belongs to',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  userId: number;
}
