# Database & Prisma Lessons

Welcome! This folder contains comprehensive lessons for students completely new to databases. These lessons will teach you the fundamentals of relational databases, SQL, and Prisma ORM.

## Who Is This For?

These lessons are designed for:
- Complete beginners to databases
- Students learning backend development
- Anyone wanting to understand how this Todo app works
- Developers new to Prisma or ORMs

## Learning Path

Follow these lessons in order:

### 1. [What is a Database?](./01-what-is-a-database.md)
**Time:** 20 minutes

Learn what databases are, why we need them, and the different types. Understand tables, rows, columns, and schemas.

**Key Concepts:**
- Why use databases vs variables or files
- Relational vs NoSQL databases
- Tables, rows, and columns
- What SQLite is

---

### 2. [SQL Fundamentals](./02-sql-fundamentals.md)
**Time:** 45 minutes

Learn SQL - the language for talking to databases. Write queries to create, read, update, and delete data.

**Key Concepts:**
- CREATE TABLE, INSERT, SELECT, UPDATE, DELETE
- WHERE clauses and filtering
- Data types and constraints
- How SQL relates to our API

**Practice:**
- Includes exercises to write SQL queries
- Shows SQL equivalents of all API operations

---

### 3. [What is an ORM?](./03-what-is-an-orm.md)
**Time:** 30 minutes

Understand the problems with raw SQL and how ORMs solve them. Learn why Prisma is a modern, type-safe ORM.

**Key Concepts:**
- Problems with raw SQL (no type safety, SQL injection)
- What Object-Relational Mapping means
- Benefits of using Prisma
- When to use ORMs vs raw SQL

---

### 4. [Understanding the Prisma Schema](./04-prisma-schema.md)
**Time:** 40 minutes

Deep dive into `schema.prisma` - the single source of truth for your database structure.

**Key Concepts:**
- Generator and datasource blocks
- Model definitions and field types
- Field attributes (@id, @default, @unique)
- How to make schema changes
- Migrations

**Practice:**
- Add new fields to the Todo model
- Create and run migrations

---

### 5. [Prisma Client CRUD Operations](./05-prisma-client-operations.md)
**Time:** 60 minutes

Learn all the Prisma Client methods for working with your database. Master create, read, update, and delete operations.

**Key Concepts:**
- create, findMany, findUnique, update, delete
- Filtering with WHERE clauses
- Sorting and pagination
- Transactions
- Raw SQL when needed

**Practice:**
- Complete exercises for each CRUD operation
- Learn advanced filtering techniques

---

### 6. [Putting It All Together](./06-putting-it-all-together.md)
**Time:** 45 minutes

See how everything connects! Trace complete request flows from HTTP request to database and back.

**Key Concepts:**
- Complete request/response cycle
- How NestJS, Prisma, and the database interact
- Dependency injection in action
- Error handling flows
- Project structure

**Practice:**
- Build a feature from scratch
- Project ideas to continue learning

---

## Total Learning Time

Approximately **4 hours** to complete all lessons with practice exercises.

## Prerequisites

Before starting, you should know:
- Basic JavaScript/TypeScript
- Basic terminal/command line usage
- How to read JSON

You do NOT need to know:
- Databases (we'll teach you!)
- SQL (we'll teach you!)
- Prisma (we'll teach you!)

## How to Use These Lessons

### Option 1: Read and Practice
1. Read each lesson in order
2. Try the examples in your own code
3. Complete the practice exercises
4. Quiz yourself with the questions

### Option 2: Build Along
1. Read the lesson
2. Open the actual code files in this project
3. Find where concepts are used
4. Experiment with changes

### Option 3: Interactive Learning
1. Read the lesson
2. Use Prisma Studio to visualize: `npx prisma studio`
3. Try SQL commands in sqlite3: `sqlite3 dev.db`
4. Test the API with curl or Swagger UI

## Key Files in This Project

As you go through the lessons, you'll frequently reference these files:

| File | Purpose | Related Lesson |
|------|---------|----------------|
| `prisma/schema.prisma` | Database structure | Lesson 4 |
| `src/prisma/prisma.service.ts` | Database client | Lesson 5 |
| `src/todo/todo.service.ts` | Database operations | Lessons 5, 6 |
| `src/todo/todo.controller.ts` | HTTP endpoints | Lesson 6 |
| `src/todo/dto/*.dto.ts` | Input validation | Lesson 6 |
| `dev.db` | SQLite database file | Lessons 1, 2 |

## Recommended Tools

### 1. Prisma Studio (Included)
Visual database browser
```bash
npx prisma studio
```
Open http://localhost:5555

### 2. SQLite CLI (Optional)
Direct SQL practice
```bash
sqlite3 dev.db
sqlite> SELECT * FROM Todo;
```

### 3. Swagger UI (Included)
Test API endpoints
```bash
npm run start:dev
```
Open http://localhost:3000/api

### 4. VSCode Extensions (Recommended)
- **Prisma** - Syntax highlighting for schema files
- **SQLite Viewer** - View database files
- **Thunder Client** - API testing (alternative to curl)

## Getting Help

### While Learning

1. **Check the project docs** in `/docs` folder
2. **Use Prisma Studio** to visualize your data
3. **Check the error messages** - they're usually helpful!
4. **Look at the code examples** in `src/`

### Official Documentation

- [Prisma Docs](https://www.prisma.io/docs) - Comprehensive ORM documentation
- [NestJS Docs](https://docs.nestjs.com) - Framework documentation
- [SQLite Docs](https://www.sqlite.org/docs.html) - Database documentation

### Online Resources

- [SQLBolt](https://sqlbolt.com/) - Interactive SQL tutorial
- [DB Fiddle](https://www.db-fiddle.com/) - Online SQL playground
- [Prisma Discord](https://pris.ly/discord) - Community support

## Practice Projects

After completing the lessons, try building:

1. **Blog API**
   - Posts, comments, authors
   - One-to-many relationships
   - Rich text content

2. **Task Manager**
   - Projects, tasks, subtasks
   - Nested relationships
   - Status tracking

3. **Library System**
   - Books, authors, borrowers
   - Many-to-many relationships
   - Due dates and fines

4. **E-commerce**
   - Products, orders, customers
   - Complex relationships
   - Transaction handling

5. **Social Media**
   - Users, posts, likes, follows
   - Self-referential relationships
   - Activity feeds

## Quick Reference

### Common Commands

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Start development server
npm run start:dev

# Open Prisma Studio
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset
```

### API Endpoints

```bash
# Create todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task"}'

# Get all todos
curl http://localhost:3000/todos

# Get one todo
curl http://localhost:3000/todos/1

# Update todo
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete todo
curl -X DELETE http://localhost:3000/todos/1
```

## What You'll Learn

By the end of these lessons, you'll be able to:

✅ Explain what databases are and why we use them
✅ Write basic SQL queries
✅ Understand how ORMs work
✅ Define database schemas with Prisma
✅ Perform CRUD operations with Prisma Client
✅ Trace request flows through the entire application
✅ Build your own database-backed APIs

## Lesson Completion Checklist

Track your progress:

- [ ] Lesson 1: What is a Database?
- [ ] Lesson 2: SQL Fundamentals
- [ ] Lesson 3: What is an ORM?
- [ ] Lesson 4: Understanding the Prisma Schema
- [ ] Lesson 5: Prisma Client CRUD Operations
- [ ] Lesson 6: Putting It All Together
- [ ] Built a practice project

## Tips for Success

1. **Don't rush** - Take time to understand each concept
2. **Practice actively** - Type the code, don't just read
3. **Experiment** - Break things and fix them
4. **Ask questions** - Use the community resources
5. **Build projects** - Apply what you learn

## Feedback

These lessons are designed for learners. If you have suggestions for improvements:
- Open an issue on the project repository
- Submit a pull request with corrections
- Share your learning experience

---

Happy Learning! 🚀

Start with [Lesson 1: What is a Database?](./01-what-is-a-database.md)
