import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UserController - HTTP request handler for user operations
 *
 * Follows the same pattern as TodoController:
 * - Uses decorators for routing and validation
 * - Swagger/OpenAPI documentation for all endpoints
 * - ParseIntPipe for ID validation
 * - ParseBoolPipe for boolean query parameters
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * POST /users - Create a new user
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * GET /users - Get all users
   * Optional query parameter: includeTodos=true to include user's todos
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'includeTodos',
    required: false,
    type: Boolean,
    description: 'Include todos in response',
  })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAll(
    @Query('includeTodos', new ParseBoolPipe({ optional: true }))
    includeTodos?: boolean,
  ) {
    return this.userService.findAll(includeTodos || false);
  }

  /**
   * GET /users/:id - Get a single user by ID
   * Optional query parameter: includeTodos=true to include user's todos
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'The user ID', example: 1 })
  @ApiQuery({
    name: 'includeTodos',
    required: false,
    type: Boolean,
    description: 'Include todos in response',
  })
  @ApiResponse({ status: 200, description: 'The user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeTodos', new ParseBoolPipe({ optional: true }))
    includeTodos?: boolean,
  ) {
    return this.userService.findOne(id, includeTodos || false);
  }

  /**
   * PATCH /users/:id - Update a user
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'The user ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id - Delete a user
   * WARNING: This will also delete all todos belonging to this user (CASCADE)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (cascades to todos)' })
  @ApiParam({ name: 'id', description: 'The user ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
