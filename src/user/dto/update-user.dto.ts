import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * UpdateUserDto - Data Transfer Object for updating an existing user
 *
 * Uses PartialType to make all CreateUserDto fields optional
 * This allows partial updates (PATCH requests)
 * Follows the same pattern as UpdateTodoDto
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
