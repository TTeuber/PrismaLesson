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
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

/**
 * TodoController - HTTP request handler for todo operations
 *
 * What is a Controller?
 * - Controllers handle incoming HTTP requests and return responses
 * - They define routes (endpoints) for your API
 * - They delegate business logic to services
 *
 * Decorators explained:
 * - @Controller('todos') - Sets the base route to /todos
 * - @ApiTags('todos') - Groups endpoints in Swagger UI
 * - @Get(), @Post(), etc. - Define HTTP methods for routes
 */
@ApiTags('todos')
@Controller('todos')
export class TodoController {
  // TodoService is injected via constructor injection
  constructor(private readonly todoService: TodoService) {}

  /**
   * POST /todos - Create a new todo
   *
   * @Body() decorator:
   * - Extracts the request body and validates it against CreateTodoDto
   * - Validation happens automatically via the global ValidationPipe
   * - Invalid requests get a 400 Bad Request response
   *
   * Required fields:
   * - title: The todo item text
   * - userId: The ID of the user this todo belongs to
   *
   * Optional fields:
   * - completed: Whether the todo is completed (default: false)
   */
  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or user not found',
  })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  /**
   * GET /todos - Get all todos
   *
   * Query parameters:
   * - userId: Filter todos by user ID (optional)
   * - includeUser: Include user data in response (optional, default: true)
   *
   * Examples:
   * - GET /todos - All todos with user data
   * - GET /todos?userId=1 - Todos for user 1 with user data
   * - GET /todos?includeUser=false - All todos without user data
   */
  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'Filter todos by user ID',
  })
  @ApiQuery({
    name: 'includeUser',
    required: false,
    type: Boolean,
    description: 'Include user data in response',
    default: true,
  })
  @ApiResponse({ status: 200, description: 'List of all todos' })
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('includeUser', new ParseBoolPipe({ optional: true }))
    includeUser?: boolean,
  ) {
    return this.todoService.findAll(userId, includeUser !== false);
  }

  /**
   * GET /todos/:id - Get a single todo by ID
   *
   * @Param('id') decorator:
   * - Extracts the 'id' from the URL path
   *
   * ParseIntPipe:
   * - Transforms the string parameter to a number
   * - Returns 400 Bad Request if the value isn't a valid integer
   * - Example: /todos/abc would fail, /todos/1 would pass
   *
   * Query parameters:
   * - includeUser: Include user data in response (optional, default: true)
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiParam({ name: 'id', description: 'The todo ID', example: 1 })
  @ApiQuery({
    name: 'includeUser',
    required: false,
    type: Boolean,
    description: 'Include user data in response',
    default: true,
  })
  @ApiResponse({ status: 200, description: 'The todo item' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeUser', new ParseBoolPipe({ optional: true }))
    includeUser?: boolean,
  ) {
    return this.todoService.findOne(id, includeUser !== false);
  }

  /**
   * PATCH /todos/:id - Update a todo
   *
   * Why PATCH instead of PUT?
   * - PATCH is for partial updates (only send fields you want to change)
   * - PUT is for full replacement (must send all fields)
   * - PATCH is more practical for most update operations
   *
   * You can update any combination of fields:
   * - title: Change the todo text
   * - completed: Mark as completed or incomplete
   * - userId: Reassign the todo to a different user
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiParam({ name: 'id', description: 'The todo ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or user not found',
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto);
  }

  /**
   * DELETE /todos/:id - Delete a todo
   *
   * Returns the deleted todo as confirmation
   * Throws 404 if the todo doesn't exist
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiParam({ name: 'id', description: 'The todo ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }
}
