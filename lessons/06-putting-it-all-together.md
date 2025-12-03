# Lesson 6: Putting It All Together

## The Complete Flow

Let's trace what happens when a user creates a todo through our API. We'll see how all the concepts from previous lessons work together.

## Example: Creating a Todo

### 1. User Makes HTTP Request

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Prisma", "completed": false}'
```

### 2. NestJS Receives Request

The request hits our controller (`src/todo/todo.controller.ts`):

```typescript
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }
}
```

**What happens here:**
- `@Post()` decorator routes POST requests to this method
- `@Body()` extracts the JSON body
- Data is validated against `CreateTodoDto`
- Method calls the service

### 3. ValidationPipe Validates Data

Before the controller method runs, ValidationPipe checks the DTO:

```typescript
// src/todo/dto/create-todo.dto.ts
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
```

**Validation checks:**
- ✅ `title` is a string: "Learn Prisma"
- ✅ `title` is not empty
- ✅ `completed` is a boolean: false

If validation fails:
```json
{
  "statusCode": 400,
  "message": ["title should not be empty"],
  "error": "Bad Request"
}
```

### 4. Service Handles Business Logic

The controller calls the service (`src/todo/todo.service.ts`):

```typescript
@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: createTodoDto
    });
  }
}
```

**What happens here:**
- Service receives validated DTO
- Calls Prisma Client to create record
- Prisma is injected via dependency injection

### 5. Prisma Generates SQL

Prisma Client translates the operation to SQL:

```typescript
prisma.todo.create({
  data: {
    title: "Learn Prisma",
    completed: false
  }
})
```

**Becomes SQL:**
```sql
INSERT INTO Todo (title, completed, createdAt, updatedAt)
VALUES ('Learn Prisma', false, '2025-01-15 10:00:00', '2025-01-15 10:00:00');
```

### 6. Database Executes SQL

SQLite processes the SQL statement:

```
Database: dev.db
Table: Todo

Before:
┌────┬─────────────────┬───────────┐
│ id │ title           │ completed │
├────┼─────────────────┼───────────┤
│ 1  │ Build API       │ true      │
└────┴─────────────────┴───────────┘

After:
┌────┬─────────────────┬───────────┐
│ id │ title           │ completed │
├────┼─────────────────┼───────────┤
│ 1  │ Build API       │ true      │
│ 2  │ Learn Prisma    │ false     │ ← New row!
└────┴─────────────────┴───────────┘
```

### 7. Prisma Returns Typed Object

The database returns the new record, Prisma wraps it in a typed object:

```typescript
{
  id: 2,
  title: "Learn Prisma",
  completed: false,
  createdAt: Date(2025-01-15T10:00:00.000Z),
  updatedAt: Date(2025-01-15T10:00:00.000Z)
}
```

TypeScript knows the exact shape of this object!

### 8. Service Returns to Controller

```typescript
async create(createTodoDto: CreateTodoDto) {
  return this.prisma.todo.create({
    data: createTodoDto
  });
  // Returns typed Todo object
}
```

### 9. Controller Returns to NestJS

```typescript
@Post()
create(@Body() createTodoDto: CreateTodoDto) {
  return this.todoService.create(createTodoDto);
  // Returns Todo object
}
```

### 10. NestJS Sends HTTP Response

NestJS serializes the object to JSON and sends response:

**Response:** `201 Created`
```json
{
  "id": 2,
  "title": "Learn Prisma",
  "completed": false,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

## Complete Flow Diagram

```
HTTP Request
     │
     ▼
┌──────────────────────┐
│   NestJS Router      │  Routes to correct controller
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   ValidationPipe     │  Validates request body against DTO
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│  TodoController      │  Extracts data, calls service
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   TodoService        │  Business logic
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   PrismaService      │  Database client
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   Prisma Client      │  Generates SQL
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   SQLite Database    │  Executes SQL, stores data
└──────────────────────┘
     │
     ▼
HTTP Response
```

## Reading All Todos

Let's trace `GET /todos`:

### Request
```bash
curl http://localhost:3000/todos
```

### Controller
```typescript
@Get()
findAll() {
  return this.todoService.findAll();
}
```

### Service
```typescript
async findAll() {
  return this.prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }
  });
}
```

### SQL Generated
```sql
SELECT * FROM Todo ORDER BY createdAt DESC;
```

### Response
```json
[
  {
    "id": 2,
    "title": "Learn Prisma",
    "completed": false,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  },
  {
    "id": 1,
    "title": "Build API",
    "completed": true,
    "createdAt": "2025-01-15T09:00:00.000Z",
    "updatedAt": "2025-01-15T09:00:00.000Z"
  }
]
```

## Updating a Todo

Let's trace `PATCH /todos/1`:

### Request
```bash
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Controller
```typescript
@Patch(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateTodoDto: UpdateTodoDto
) {
  return this.todoService.update(id, updateTodoDto);
}
```

**ParseIntPipe:**
- Converts string "1" from URL to number 1
- Validates it's a valid integer
- Returns 400 if not a number

### Service
```typescript
async update(id: number, updateTodoDto: UpdateTodoDto) {
  // First, check if exists
  await this.findOne(id);

  // Then update
  return this.prisma.todo.update({
    where: { id },
    data: updateTodoDto
  });
}

async findOne(id: number) {
  const todo = await this.prisma.todo.findUnique({
    where: { id }
  });

  if (!todo) {
    throw new NotFoundException(`Todo with ID ${id} not found`);
  }

  return todo;
}
```

### SQL Generated
```sql
-- Check if exists
SELECT * FROM Todo WHERE id = 1 LIMIT 1;

-- Update
UPDATE Todo
SET completed = true, updatedAt = '2025-01-15 10:30:00'
WHERE id = 1;
```

### Response
```json
{
  "id": 1,
  "title": "Build API",
  "completed": true,
  "createdAt": "2025-01-15T09:00:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

## Error Handling Example

### Request for Non-existent Todo
```bash
curl http://localhost:3000/todos/999
```

### Service
```typescript
async findOne(id: number) {
  const todo = await this.prisma.todo.findUnique({
    where: { id }
  });

  if (!todo) {
    throw new NotFoundException(`Todo with ID ${id} not found`);
  }

  return todo;
}
```

### Response: `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Todo with ID 999 not found",
  "error": "Not Found"
}
```

## Dependency Injection in Action

### How PrismaService is Injected

**1. PrismaService is marked @Injectable:**
```typescript
@Injectable()
export class PrismaService extends PrismaClient {
  // ...
}
```

**2. PrismaModule provides it:**
```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```

**3. TodoService requests it:**
```typescript
@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  //          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //          NestJS automatically injects PrismaService instance
}
```

**4. NestJS creates instances:**
```
NestJS Container:
├── PrismaService (singleton)
└── TodoService (singleton, receives PrismaService)
```

## Project Structure Review

```
src/
├── main.ts
│   └── Entry point: Creates NestJS app, sets up ValidationPipe, Swagger
│
├── app.module.ts
│   └── Root module: Imports PrismaModule, TodoModule
│
├── prisma/
│   ├── prisma.module.ts
│   │   └── Global module providing PrismaService
│   └── prisma.service.ts
│       └── Database client with connection lifecycle
│
└── todo/
    ├── todo.module.ts
    │   └── Feature module: Declares controller and service
    ├── todo.controller.ts
    │   └── HTTP endpoints: Routes requests to service
    ├── todo.service.ts
    │   └── Business logic: Uses PrismaService for database ops
    └── dto/
        ├── create-todo.dto.ts
        │   └── Validation for creating todos
        └── update-todo.dto.ts
            └── Validation for updating todos (PartialType)
```

## Database Files

```
prisma/
├── schema.prisma
│   └── Database schema definition
├── prisma.config.ts
│   └── Prisma 7 configuration (database URL)
└── migrations/
    └── 20250115100000_init/
        └── migration.sql
            └── SQL to create Todo table
dev.db
└── SQLite database file (binary)
```

## Full Example: Build the App

Let's trace building a complete feature from scratch:

### 1. Define Database Schema

```prisma
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Create Migration

```bash
npx prisma migrate dev --name init
```

Generates SQL:
```sql
CREATE TABLE Todo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Create DTOs

```typescript
// create-todo.dto.ts
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

// update-todo.dto.ts
export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
```

### 4. Create Service

```typescript
@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTodoDto) {
    return this.prisma.todo.create({ data });
  }

  async findAll() {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id }
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: number, data: UpdateTodoDto) {
    await this.findOne(id);
    return this.prisma.todo.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.todo.delete({
      where: { id }
    });
  }
}
```

### 5. Create Controller

```typescript
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto
  ) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }
}
```

### 6. Create Module

```typescript
@Module({
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}
```

### 7. Import in AppModule

```typescript
@Module({
  imports: [PrismaModule, TodoModule],
  // ...
})
export class AppModule {}
```

### 8. Test It!

```bash
# Start server
npm run start:dev

# Create todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Prisma"}'

# Get all todos
curl http://localhost:3000/todos

# Update todo
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete todo
curl -X DELETE http://localhost:3000/todos/1
```

## Key Takeaways

### 1. Separation of Concerns

- **Controllers** handle HTTP requests
- **Services** contain business logic
- **Prisma** handles database operations
- **DTOs** validate input
- **Schema** defines structure

### 2. Type Safety Everywhere

```typescript
// TypeScript knows everything!
const todo = await prisma.todo.create({
  data: { title: "Learn" }
});

todo.id;        // number ✅
todo.title;     // string ✅
todo.completed; // boolean ✅
todo.foobar;    // Error! ❌
```

### 3. Automatic Features

- **ValidationPipe** validates requests
- **@updatedAt** auto-updates timestamps
- **ParseIntPipe** converts URL params
- **Dependency Injection** provides instances
- **Swagger** generates documentation

### 4. Error Handling

- Validation errors return 400
- Not found errors return 404
- Server errors return 500
- All errors have consistent format

## What You've Learned

You now understand:

1. **Databases** - Structured data storage
2. **SQL** - Language for querying databases
3. **ORMs** - Tools that generate SQL for you
4. **Prisma Schema** - Defining database structure
5. **Prisma Client** - Type-safe database operations
6. **NestJS Architecture** - How everything connects

## Next Steps

To continue learning:

1. **Add Features:**
   - Add priority field to todos
   - Add tags
   - Add due dates
   - Add user authentication

2. **Learn Relations:**
   - Create User model
   - Link todos to users
   - One-to-many relationships

3. **Advanced Queries:**
   - Pagination
   - Filtering
   - Sorting
   - Full-text search

4. **Testing:**
   - Unit tests for services
   - Integration tests for controllers
   - E2E tests for full flows

5. **Deployment:**
   - Switch to PostgreSQL
   - Deploy to production
   - Set up CI/CD

## Recommended Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [REST API Design](https://restfulapi.net/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

## Practice Project Ideas

1. **Blog API** - Posts, comments, authors
2. **Task Manager** - Projects, tasks, subtasks
3. **E-commerce** - Products, orders, customers
4. **Social Media** - Users, posts, likes, follows
5. **Library System** - Books, authors, borrowers

Congratulations on completing the lessons! You're ready to build full-stack applications with NestJS and Prisma!
