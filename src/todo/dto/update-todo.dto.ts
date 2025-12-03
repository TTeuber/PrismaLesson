import { PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';

/**
 * UpdateTodoDto - Data Transfer Object for updating an existing todo
 *
 * What is PartialType?
 * - PartialType is a utility from @nestjs/swagger
 * - It takes a class and makes ALL its properties optional
 * - This is perfect for PATCH requests where you only send fields to update
 *
 * Why extend CreateTodoDto?
 * - DRY (Don't Repeat Yourself) - we reuse the validation rules
 * - If we add a new field to CreateTodoDto, it's automatically available here
 * - Swagger documentation is inherited and updated automatically
 *
 * Example usage:
 * - PATCH /todos/1 with { "completed": true } - only updates completed
 * - PATCH /todos/1 with { "title": "New title" } - only updates title
 * - PATCH /todos/1 with { "title": "New", "completed": true } - updates both
 */
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
