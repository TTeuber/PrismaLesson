# NestJS Architecture Guide

This document explains how NestJS organizes code and how requests flow through the application.

## Core Concepts

### 1. Modules

Modules are the basic building blocks of a NestJS application. They organize related code together.

```typescript
@Module({
  imports: [PrismaModule, TodoModule],  // Other modules we need
  controllers: [AppController],          // HTTP request handlers
  providers: [AppService],               // Services and business logic
})
export class AppModule {}
```

**Think of modules like folders** that group related features. Each feature (like "todos") gets its own module.

### 2. Controllers

Controllers handle HTTP requests. They:
- Define routes (endpoints)
- Extract data from requests
- Call services
- Return responses

```typescript
@Controller('todos')  // Base route: /todos
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()              // GET /todos
  findAll() {
    return this.todoService.findAll();
  }

  @Post()             // POST /todos
  create(@Body() dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }

  @Get(':id')         // GET /todos/1
  findOne(@Param('id') id: number) {
    return this.todoService.findOne(id);
  }
}
```

### 3. Services

Services contain business logic. They:
- Are reusable across controllers
- Handle database operations
- Contain validation logic
- Are easy to test

```typescript
@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.todo.findMany();
  }

  async create(data: CreateTodoDto) {
    return this.prisma.todo.create({ data });
  }
}
```

### 4. DTOs (Data Transfer Objects)

DTOs define the shape of data for specific operations:

```typescript
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
```

## Request Flow

Here's how a request travels through the application:

```
HTTP Request
     │
     ▼
┌─────────────┐
│   main.ts   │  ← Entry point, creates app
└─────────────┘
     │
     ▼
┌─────────────┐
│ Validation  │  ← ValidationPipe checks the request body
│    Pipe     │
└─────────────┘
     │
     ▼
┌─────────────┐
│ Controller  │  ← Receives request, extracts data
└─────────────┘
     │
     ▼
┌─────────────┐
│   Service   │  ← Business logic, database operations
└─────────────┘
     │
     ▼
┌─────────────┐
│   Prisma    │  ← Database query
└─────────────┘
     │
     ▼
HTTP Response
```

## Dependency Injection

NestJS automatically creates and provides instances of classes. This is called Dependency Injection (DI).

### How it works:

1. **Mark a class as injectable:**
   ```typescript
   @Injectable()
   export class TodoService { }
   ```

2. **Request it in a constructor:**
   ```typescript
   export class TodoController {
     constructor(private todoService: TodoService) { }
   }
   ```

3. **NestJS provides the instance automatically!**

### Benefits:
- Easy to test (you can provide mock services)
- Loose coupling between components
- Automatic lifecycle management

## Decorators Explained

Decorators are the `@Something()` syntax. They add metadata to classes, methods, and parameters.

### Class Decorators
| Decorator | Purpose |
|-----------|---------|
| `@Module()` | Defines a module |
| `@Controller()` | Defines a controller |
| `@Injectable()` | Makes a class injectable |

### Method Decorators
| Decorator | HTTP Method |
|-----------|-------------|
| `@Get()` | GET |
| `@Post()` | POST |
| `@Patch()` | PATCH |
| `@Put()` | PUT |
| `@Delete()` | DELETE |

### Parameter Decorators
| Decorator | Extracts |
|-----------|----------|
| `@Body()` | Request body |
| `@Param()` | URL parameters |
| `@Query()` | Query string |

### Example with all decorators:

```typescript
@Controller('todos')                    // Class decorator
export class TodoController {

  @Patch(':id')                        // Method decorator
  update(
    @Param('id') id: number,           // Parameter decorator
    @Body() dto: UpdateTodoDto         // Parameter decorator
  ) {
    // ...
  }
}
```

## File Naming Conventions

NestJS uses these naming patterns:

| Type | Pattern | Example |
|------|---------|---------|
| Module | `*.module.ts` | `todo.module.ts` |
| Controller | `*.controller.ts` | `todo.controller.ts` |
| Service | `*.service.ts` | `todo.service.ts` |
| DTO | `*.dto.ts` | `create-todo.dto.ts` |

## Creating a New Feature

To add a new feature (like "users"), create these files:

```
src/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
└── dto/
    ├── create-user.dto.ts
    └── update-user.dto.ts
```

Then import `UsersModule` in `AppModule`.

## Tips for Learning

1. **Follow the flow** - Start at the controller, trace to service, then to database
2. **Use the NestJS CLI** - `nest generate` creates boilerplate for you
3. **Read the decorators** - They tell you what each piece does
4. **Think in modules** - Group related functionality together

## Further Reading

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Dependency Injection Explained](https://docs.nestjs.com/providers)
