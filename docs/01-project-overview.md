# Project Overview

This is an educational CRUD (Create, Read, Update, Delete) Todo application built with modern web technologies. It demonstrates best practices for building REST APIs with NestJS and Prisma.

## What This App Does

The Todo API allows you to:
- Create new todo items
- View all todos or a specific todo
- Update existing todos (mark as complete, change title)
- Delete todos

## Technologies Used

### NestJS
NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

**Why NestJS?**
- Built-in dependency injection
- Modular architecture
- TypeScript support out of the box
- Great documentation and community
- Built-in support for testing

### Prisma
Prisma is a next-generation ORM (Object-Relational Mapping) that makes working with databases easy and type-safe.

**Why Prisma?**
- Type-safe database queries
- Auto-generated TypeScript types
- Visual database management with Prisma Studio
- Easy migrations
- Works with many databases (PostgreSQL, MySQL, SQLite, etc.)

### SQLite
SQLite is a lightweight, file-based database. It's perfect for development, demos, and small applications.

**Why SQLite?**
- No server setup required
- Database is just a file
- Easy to reset and share
- Great for learning and prototyping

## Project Structure

```
PrismaDemo/
├── src/                          # Source code
│   ├── main.ts                   # Application entry point
│   ├── app.module.ts             # Root module
│   ├── app.controller.ts         # Root controller
│   ├── app.service.ts            # Root service
│   ├── prisma/                   # Database module
│   │   ├── prisma.module.ts      # Prisma module definition
│   │   └── prisma.service.ts     # Prisma client service
│   └── todo/                     # Todo feature module
│       ├── todo.module.ts        # Todo module definition
│       ├── todo.controller.ts    # HTTP endpoints
│       ├── todo.service.ts       # Business logic
│       └── dto/                  # Data Transfer Objects
│           ├── create-todo.dto.ts
│           └── update-todo.dto.ts
├── prisma/                       # Database configuration
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── docs/                         # Documentation (you are here!)
├── dev.db                        # SQLite database file
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

3. **Start the application:**
   ```bash
   npm run start:dev
   ```

4. **Open Swagger documentation:**
   Visit http://localhost:3000/api to see the interactive API docs.

## Next Steps

- Read [02-prisma-setup.md](./02-prisma-setup.md) to learn about the database layer
- Read [03-nestjs-architecture.md](./03-nestjs-architecture.md) to understand how NestJS works
- Read [04-validation-and-dtos.md](./04-validation-and-dtos.md) to learn about input validation
- Read [05-api-reference.md](./05-api-reference.md) for complete API documentation
