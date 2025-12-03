import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UserService - Business logic layer for user operations
 *
 * Mirrors the pattern used in TodoService:
 * - Injected PrismaService for database access
 * - Async methods for all CRUD operations
 * - Throws NotFoundException when user not found
 */
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user
   * @param createUserDto - The data for the new user
   * @returns The created user with all fields including id, createdAt, updatedAt
   */
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  /**
   * Get all users
   * @param includeTodos - Whether to include the user's todos in the response
   * @returns Array of all users, ordered by creation date (newest first)
   */
  async findAll(includeTodos = false) {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: includeTodos ? { todos: true } : undefined,
    });
  }

  /**
   * Get a single user by ID
   * @param id - The user's unique identifier
   * @param includeTodos - Whether to include the user's todos in the response
   * @returns The user if found
   * @throws NotFoundException if user doesn't exist
   */
  async findOne(id: number, includeTodos = false) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: includeTodos ? { todos: true } : undefined,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Update an existing user
   * @param id - The user's unique identifier
   * @param updateUserDto - The fields to update (partial update supported)
   * @returns The updated user
   * @throws NotFoundException if user doesn't exist
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    // First check if the user exists
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  /**
   * Delete a user by ID
   * WARNING: Due to onDelete: Cascade, this will also delete all the user's todos
   * @param id - The user's unique identifier
   * @returns The deleted user
   * @throws NotFoundException if user doesn't exist
   */
  async remove(id: number) {
    // First check if the user exists
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
