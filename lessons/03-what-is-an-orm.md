# Lesson 3: What is an ORM?

## The Problem with Raw SQL

Writing SQL directly has some challenges:

### 1. SQL is Just Strings
```typescript
// Easy to make typos - no autocomplete!
const query = "SELCT * FROM Todo WERE id = 1";
//            ^^^^^^ typo!        ^^^^^ typo!

// No way to catch errors until runtime
await db.query(query);
```

### 2. No Type Safety
```typescript
const result = await db.query("SELECT * FROM Todo WHERE id = 1");

// What does result contain? 🤷
// Is it result.title or result.name?
// Is it result[0] or result.data?
// TypeScript doesn't know!
console.log(result.???);
```

### 3. SQL Injection Vulnerabilities
```typescript
// DANGER! User input directly in query
const userId = req.body.id; // Could be: "1; DROP TABLE Todo; --"
const query = `SELECT * FROM Todo WHERE id = ${userId}`;

// This could delete your entire database! 💥
await db.query(query);
```

### 4. Database Differences
```sql
-- PostgreSQL
SELECT * FROM Todo LIMIT 10 OFFSET 20;

-- SQL Server
SELECT * FROM Todo
ORDER BY id
OFFSET 20 ROWS
FETCH NEXT 10 ROWS ONLY;

-- Same thing, different syntax!
```

## What is an ORM?

**ORM** = **O**bject-**R**elational **M**apping

An ORM is a tool that:
- Translates between database tables and TypeScript/JavaScript objects
- Generates SQL for you
- Provides type safety
- Protects against SQL injection
- Makes database code easier to write and maintain

### Without ORM (Raw SQL)
```typescript
const result = await db.query(
  "SELECT * FROM Todo WHERE id = ?",
  [1]
);
const todo = result[0]; // What type is this? 🤷
console.log(todo.title); // Hope this exists!
```

### With ORM (Prisma)
```typescript
const todo = await prisma.todo.findUnique({
  where: { id: 1 }
});
//    ↑ TypeScript knows the exact shape!
console.log(todo.title); // ✅ Autocomplete works!
```

## Popular ORMs

| ORM | Language | Features |
|-----|----------|----------|
| **Prisma** | TypeScript/JavaScript | Type-safe, auto-generated types, migrations |
| **TypeORM** | TypeScript | Decorators, Active Record/Data Mapper |
| **Sequelize** | JavaScript | Mature, widely used, supports many DBs |
| **Hibernate** | Java | Very popular in Java world |
| **Entity Framework** | C# | Microsoft's ORM for .NET |
| **SQLAlchemy** | Python | Flexible, powerful |

## Why Prisma?

Prisma is a modern ORM that's especially great for TypeScript projects:

### 1. Type Safety
Prisma generates TypeScript types from your schema:

```typescript
// Prisma knows exactly what fields exist
const todo = await prisma.todo.create({
  data: {
    title: "Learn Prisma",
    completed: false,
    // foobar: true  // ❌ Error! Field doesn't exist
  }
});

// Full autocomplete
todo.id;        // ✅
todo.title;     // ✅
todo.completed; // ✅
todo.foobar;    // ❌ Error! Property doesn't exist
```

### 2. Auto-Generated Types
After defining your schema, run `npx prisma generate` and Prisma creates types automatically:

```typescript
// These types are generated for you!
type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. SQL Injection Protection
Prisma automatically escapes values:

```typescript
const userInput = req.body.title;

// Safe! Prisma handles escaping
await prisma.todo.create({
  data: { title: userInput }
});

// Even if userInput is malicious, it's treated as data, not SQL
```

### 4. Database Agnostic
Same code works with different databases:

```prisma
// Just change the provider!
datasource db {
  provider = "sqlite"      // or "postgresql", "mysql", etc.
}
```

Your application code stays the same.

### 5. Migrations
Prisma tracks database changes:

```bash
# Make schema changes, then:
npx prisma migrate dev --name add_priority_field

# Prisma creates and applies SQL migration
# Regenerates types
# Updates your database
```

## How Prisma Works

```
┌─────────────────────────────────────────┐
│  1. You write schema (schema.prisma)   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  2. Prisma generates TypeScript types   │
│     and Prisma Client                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  3. You use Prisma Client in your code  │
│     prisma.todo.create(...)             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  4. Prisma translates to SQL            │
│     INSERT INTO Todo ...                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  5. Database executes SQL               │
│     Returns results                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  6. Prisma returns typed objects        │
│     { id: 1, title: "...", ... }        │
└─────────────────────────────────────────┘
```

## Comparing SQL to Prisma

### Create (INSERT)

**SQL:**
```sql
INSERT INTO Todo (title, completed, createdAt, updatedAt)
VALUES ('Learn Prisma', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

**Prisma:**
```typescript
await prisma.todo.create({
  data: {
    title: 'Learn Prisma'
    // completed, createdAt, updatedAt use defaults
  }
});
```

### Read (SELECT)

**SQL:**
```sql
-- Get all
SELECT * FROM Todo ORDER BY createdAt DESC;

-- Get one
SELECT * FROM Todo WHERE id = 1;

-- Get filtered
SELECT * FROM Todo WHERE completed = true;
```

**Prisma:**
```typescript
// Get all
await prisma.todo.findMany({
  orderBy: { createdAt: 'desc' }
});

// Get one
await prisma.todo.findUnique({
  where: { id: 1 }
});

// Get filtered
await prisma.todo.findMany({
  where: { completed: true }
});
```

### Update (UPDATE)

**SQL:**
```sql
UPDATE Todo
SET completed = true, updatedAt = CURRENT_TIMESTAMP
WHERE id = 1;
```

**Prisma:**
```typescript
await prisma.todo.update({
  where: { id: 1 },
  data: { completed: true }
  // updatedAt is automatic with @updatedAt
});
```

### Delete (DELETE)

**SQL:**
```sql
DELETE FROM Todo WHERE id = 1;
```

**Prisma:**
```typescript
await prisma.todo.delete({
  where: { id: 1 }
});
```

## When to Use an ORM

### ✅ Good Use Cases
- Building a web application with standard CRUD operations
- Want type safety and autocomplete
- Team is more comfortable with TypeScript than SQL
- Need to support multiple databases
- Rapid prototyping

### ⚠️ Consider Raw SQL When
- Complex queries with multiple joins
- Performance-critical operations
- Need database-specific features
- Already have a lot of SQL expertise

**Good news:** Prisma lets you use raw SQL when needed!

```typescript
// You can still write SQL with Prisma
const result = await prisma.$queryRaw`
  SELECT * FROM Todo
  WHERE title LIKE ${'%prisma%'}
`;
```

## Advantages of Using Prisma

1. **Developer Experience**
   - Autocomplete everywhere
   - Catch errors before runtime
   - Clear, readable code

2. **Safety**
   - SQL injection protection
   - Type checking
   - Schema validation

3. **Productivity**
   - Less boilerplate
   - Auto-generated migrations
   - Visual database browser (Prisma Studio)

4. **Maintainability**
   - Schema as single source of truth
   - Easy to refactor
   - Clear data model

## Disadvantages to Consider

1. **Learning Curve**
   - Need to learn Prisma API
   - Understand schema syntax

2. **Abstraction**
   - Less control over exact SQL
   - May generate non-optimal queries

3. **Debugging**
   - Need to understand what SQL is generated
   - Can enable query logging:
     ```typescript
     const prisma = new PrismaClient({
       log: ['query'],
     });
     ```

## Best of Both Worlds

Prisma gives you flexibility:

```typescript
// Use Prisma for simple queries
const todos = await prisma.todo.findMany();

// Use raw SQL for complex queries
const stats = await prisma.$queryRaw`
  SELECT
    DATE(createdAt) as date,
    COUNT(*) as count
  FROM Todo
  GROUP BY DATE(createdAt)
`;
```

## What's Next?

In the next lesson, we'll dive into Prisma's schema language and see how it defines our database structure. You'll learn how to:
- Define models
- Set up relationships
- Add constraints
- Use migrations

## Quick Quiz

1. What does ORM stand for?
2. Name two problems with writing raw SQL
3. How does Prisma provide type safety?
4. Can you still use raw SQL with Prisma?

**Answers:**
1. Object-Relational Mapping
2. No type safety, easy to make typos, SQL injection vulnerabilities, database-specific syntax
3. Prisma generates TypeScript types from your schema automatically
4. Yes! Use `$queryRaw` or `$executeRaw`
