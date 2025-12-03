# Prisma Setup Guide

This document explains how Prisma is configured in this project and the key concepts you need to understand.

## What is Prisma?

Prisma is an ORM (Object-Relational Mapping) that:
- Translates your database schema into TypeScript types
- Provides a type-safe query API
- Handles database migrations
- Works with multiple databases

## Key Files

### prisma/schema.prisma

This is the heart of Prisma. It defines:
1. **Database connection** - Which database to use
2. **Generator** - How to generate the Prisma Client
3. **Models** - Your database tables

```prisma
// Generator: Creates the Prisma Client
generator client {
  provider = "prisma-client-js"
}

// Datasource: Database connection
datasource db {
  provider = "sqlite"
}

// Model: A table in your database
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Understanding the Todo Model

| Field | Type | Attributes | Description |
|-------|------|------------|-------------|
| `id` | Int | `@id @default(autoincrement())` | Primary key, auto-increments |
| `title` | String | (none) | Required string field |
| `completed` | Boolean | `@default(false)` | Defaults to false if not provided |
| `createdAt` | DateTime | `@default(now())` | Automatically set on creation |
| `updatedAt` | DateTime | `@updatedAt` | Automatically updated on changes |

### prisma.config.ts

Prisma 7+ uses a TypeScript config file for additional settings:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
```

## Prisma Client in NestJS

### The PrismaService

We extend `PrismaClient` to integrate with NestJS's lifecycle:

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || 'file:./dev.db',
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
```

**Key points:**
- `@Injectable()` makes it available for dependency injection
- `extends PrismaClient` gives us all Prisma methods
- `OnModuleInit` connects when the app starts
- Prisma 7+ requires a driver adapter (like `PrismaBetterSqlite3`)

### Using PrismaService

In any service, inject and use PrismaService:

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

## Common Prisma Operations

### Create
```typescript
await prisma.todo.create({
  data: { title: "Learn Prisma" }
});
```

### Read
```typescript
// Find all
await prisma.todo.findMany();

// Find one by ID
await prisma.todo.findUnique({ where: { id: 1 } });

// Find with filter
await prisma.todo.findMany({
  where: { completed: false }
});
```

### Update
```typescript
await prisma.todo.update({
  where: { id: 1 },
  data: { completed: true }
});
```

### Delete
```typescript
await prisma.todo.delete({ where: { id: 1 } });
```

## Migrations

Migrations track changes to your database schema.

### Create a migration
```bash
npx prisma migrate dev --name add_priority_field
```

### Apply migrations
```bash
npx prisma migrate deploy
```

### Reset database
```bash
npx prisma migrate reset
```

## Prisma Studio

Prisma includes a visual database browser:

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can view and edit your data.

## Environment Variables

The database URL is configured in `.env`:

```env
DATABASE_URL="file:./dev.db"
```

For SQLite, the format is `file:./path/to/database.db`.

## Tips for Learning

1. **Use Prisma Studio** to visualize your data
2. **Check generated types** in `node_modules/@prisma/client`
3. **Read error messages** - Prisma errors are very descriptive
4. **Use TypeScript** - You get full autocomplete for queries

## Further Reading

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma with NestJS](https://docs.nestjs.com/recipes/prisma)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
