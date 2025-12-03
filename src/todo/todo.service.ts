import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

/**
 * TodoService - Business logic layer for todo operations
 *
 * What is a Service in NestJS?
 * - Services contain the business logic of your application
 * - They are injected into controllers via dependency injection
 * - They handle database operations, external API calls, etc.
 *
 * Why separate Controller and Service?
 * - Controllers handle HTTP concerns (request/response)
 * - Services handle business logic and data access
 * - This separation makes code more testable and maintainable
 *
 * The @Injectable() decorator:
 * - Marks this class as a provider that can be injected
 * - NestJS manages the lifecycle of injectable services
 */
@Injectable()
export class TodoService {
  // PrismaService is injected via constructor injection
  // NestJS automatically provides the instance when creating TodoService
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new todo item
   * @param createTodoDto - The data for the new todo
   * @returns The created todo with all fields including id, createdAt, updatedAt
   * @throws BadRequestException if the specified user doesn't exist
   */
  async create(createTodoDto: CreateTodoDto) {
    // Validate that the user exists before creating the todo
    const userExists = await this.prisma.user.findUnique({
      where: { id: createTodoDto.userId },
    });

    if (!userExists) {
      throw new BadRequestException(
        `User with ID ${createTodoDto.userId} not found`,
      );
    }

    // prisma.todo.create() inserts a new record into the Todo table
    // The 'data' property contains the values to insert
    // Include user data in the response
    return this.prisma.todo.create({
      data: createTodoDto,
      include: { user: true },
    });
  }

  /**
   * Get all todo items
   * @param userId - Optional: filter todos by user ID
   * @param includeUser - Whether to include user data in the response (default: true)
   * @returns Array of all todos, ordered by creation date (newest first)
   */
  async findAll(userId?: number, includeUser = true) {
    // prisma.todo.findMany() retrieves multiple records
    // orderBy sorts results - 'desc' means descending (newest first)
    // where clause filters by userId if provided
    // include adds related user data to the response
    return this.prisma.todo.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: includeUser ? { user: true } : undefined,
    });
  }

  /**
   * Get a single todo by ID
   * @param id - The todo's unique identifier
   * @param includeUser - Whether to include user data in the response (default: true)
   * @returns The todo if found
   * @throws NotFoundException if todo doesn't exist
   */
  async findOne(id: number, includeUser = true) {
    // findUnique retrieves a single record by a unique field (like id)
    // include adds related user data to the response
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: includeUser ? { user: true } : undefined,
    });

    // If no todo found, throw a 404 error
    // NestJS automatically converts this to an HTTP 404 response
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  /**
   * Update an existing todo
   * @param id - The todo's unique identifier
   * @param updateTodoDto - The fields to update (partial update supported)
   * @returns The updated todo
   * @throws NotFoundException if todo doesn't exist
   * @throws BadRequestException if the specified user doesn't exist (when updating userId)
   */
  async update(id: number, updateTodoDto: UpdateTodoDto) {
    // First check if the todo exists
    await this.findOne(id);

    // If userId is being updated, validate the new user exists
    if (updateTodoDto.userId !== undefined) {
      const userExists = await this.prisma.user.findUnique({
        where: { id: updateTodoDto.userId },
      });

      if (!userExists) {
        throw new BadRequestException(
          `User with ID ${updateTodoDto.userId} not found`,
        );
      }
    }

    // prisma.todo.update() modifies an existing record
    // 'where' specifies which record to update
    // 'data' contains the new values
    // Include user data in the response
    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
      include: { user: true },
    });
  }

  /**
   * Delete a todo by ID
   * @param id - The todo's unique identifier
   * @returns The deleted todo
   * @throws NotFoundException if todo doesn't exist
   */
  async remove(id: number) {
    // First check if the todo exists
    await this.findOne(id);

    // prisma.todo.delete() removes a record from the database
    // It returns the deleted record
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
