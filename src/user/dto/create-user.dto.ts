import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * CreateUserDto - Data Transfer Object for creating a new user
 *
 * Follows the same pattern as CreateTodoDto:
 * - Uses class-validator decorators for input validation
 * - Uses Swagger decorators for API documentation
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
