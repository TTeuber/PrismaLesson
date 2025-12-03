# Lesson 4: Understanding the Prisma Schema

## What is schema.prisma?

The `schema.prisma` file is the single source of truth for your database structure. It defines:
- Database connection
- Tables (called "models")
- Fields and their types
- Relationships between tables
- Constraints and defaults

## Our Todo Schema

Let's examine our complete schema:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
}

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Breaking It Down

### 1. Generator Block

```prisma
generator client {
  provider = "prisma-client-js"
}
```

**What it does:**
- Tells Prisma to generate JavaScript/TypeScript client code
- After running `npx prisma generate`, you can use `prisma.todo.create()`, etc.

**Other providers:**
- `prisma-client-py` - For Python
- `prisma-client-go` - For Go

### 2. Datasource Block

```prisma
datasource db {
  provider = "sqlite"
}
```

**What it does:**
- Specifies which database to use
- Connection URL is in `prisma.config.ts`

**Other providers:**
```prisma
provider = "postgresql"  // For PostgreSQL
provider = "mysql"       // For MySQL
provider = "mongodb"     // For MongoDB
provider = "sqlserver"   // For SQL Server
```

### 3. Model Block

```prisma
model Todo {
  // Fields go here
}
```

**What it does:**
- Defines a database table called "Todo"
- Each field becomes a column
- Translates to SQL: `CREATE TABLE Todo (...)`

## Field Anatomy

Let's look at each field in detail:

### Field 1: Primary Key

```prisma
id  Int  @id  @default(autoincrement())
│   │    │    │
│   │    │    └─ Auto-assign next number (1, 2, 3...)
│   │    └────── This is the primary key
│   └─────────── Data type: Integer
└─────────────── Field name
```

**SQL Equivalent:**
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
```

**What it means:**
- Every todo gets a unique ID
- Database automatically assigns IDs (you don't set them)
- Can't have two todos with same ID

### Field 2: Required String

```prisma
title  String
│      │
│      └─ Data type: Text
└──────── Field name
```

**SQL Equivalent:**
```sql
title TEXT NOT NULL
```

**What it means:**
- Every todo must have a title
- Can't create a todo without a title
- Can be any text (no length limit in SQLite)

### Field 3: Boolean with Default

```prisma
completed  Boolean  @default(false)
│          │        │
│          │        └─ If not specified, use false
│          └────────── Data type: True or False
└───────────────────── Field name
```

**SQL Equivalent:**
```sql
completed BOOLEAN DEFAULT false
```

**What it means:**
- Can be true or false
- If you don't specify, defaults to false
- New todos start as incomplete

### Field 4: Timestamp with Default

```prisma
createdAt  DateTime  @default(now())
│          │         │
│          │         └─ Set to current time when created
│          └─────────── Data type: Date and time
└────────────────────── Field name
```

**SQL Equivalent:**
```sql
createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
```

**What it means:**
- Automatically set when todo is created
- You never set this manually
- Records when the todo was made

### Field 5: Auto-updating Timestamp

```prisma
updatedAt  DateTime  @updatedAt
│          │         │
│          │         └─ Auto-update when record changes
│          └─────────── Data type: Date and time
└────────────────────── Field name
```

**SQL Equivalent:**
```sql
-- SQLite doesn't have this built-in
-- Prisma handles it in application code
updatedAt DATETIME
```

**What it means:**
- Automatically updated every time you modify the todo
- Prisma handles this - not a database feature
- Tracks last modification time

## Prisma Field Types

### Scalar Types (Basic)

| Prisma Type | SQL Type | TypeScript Type | Example |
|-------------|----------|-----------------|---------|
| `String` | TEXT/VARCHAR | `string` | "Hello" |
| `Boolean` | BOOLEAN | `boolean` | true/false |
| `Int` | INTEGER | `number` | 42 |
| `BigInt` | BIGINT | `bigint` | 9007199254740991n |
| `Float` | REAL/DOUBLE | `number` | 3.14 |
| `Decimal` | DECIMAL | `Decimal` | 99.99 |
| `DateTime` | TIMESTAMP | `Date` | new Date() |
| `Json` | JSON | `any` | {key: "value"} |
| `Bytes` | BLOB | `Buffer` | Binary data |

## Field Attributes

Attributes modify how fields behave:

### @id - Primary Key
```prisma
id Int @id
```
Marks the field as the unique identifier

### @default() - Default Value
```prisma
completed Boolean @default(false)
score Int @default(0)
createdAt DateTime @default(now())
```
Sets a default value if none provided

### @unique - Unique Constraint
```prisma
email String @unique
```
Ensures no two records have the same value

### @updatedAt - Auto-update Timestamp
```prisma
updatedAt DateTime @updatedAt
```
Automatically updates on record changes

### @map() - Custom Database Column Name
```prisma
firstName String @map("first_name")
```
Field is `firstName` in code, `first_name` in database

## Optional vs Required Fields

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String              // Required
  name     String?             // Optional (note the ?)
  age      Int?                // Optional
  bio      String? @default("") // Optional with default
}
```

**TypeScript types generated:**
```typescript
type User = {
  id: number;
  email: string;        // Can't be null
  name: string | null;  // Can be null
  age: number | null;   // Can be null
  bio: string | null;   // Can be null (even with default)
}
```

## Model Attributes

Attributes that apply to the entire model:

### @@id - Composite Primary Key
```prisma
model UserRole {
  userId Int
  roleId Int

  @@id([userId, roleId])
}
```
Multiple fields together form the unique identifier

### @@unique - Unique Constraint on Multiple Fields
```prisma
model User {
  email     String
  provider  String

  @@unique([email, provider])
}
```
Combination must be unique (same email can exist with different providers)

### @@index - Create Database Index
```prisma
model Todo {
  id        Int     @id
  title     String
  completed Boolean

  @@index([completed])
}
```
Speeds up queries filtering by completed

### @@map() - Custom Table Name
```prisma
model Todo {
  id Int @id

  @@map("todos")
}
```
Model is `Todo` in code, `todos` table in database

## Relationships (Preview)

While our Todo app doesn't use relationships, here's how they work:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  todos Todo[]  // User has many todos
}

model Todo {
  id       Int     @id @default(autoincrement())
  title    String
  userId   Int     // Foreign key
  user     User    @relation(fields: [userId], references: [id])
}
```

This creates a one-to-many relationship: one user can have many todos.

## Making Schema Changes

### 1. Edit schema.prisma

Let's say you want to add a priority field:

```prisma
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  priority  Int      @default(1)  // New field!
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Create Migration

```bash
npx prisma migrate dev --name add_priority
```

This:
- Generates SQL to alter the table
- Applies it to the database
- Regenerates Prisma Client with new types

**Generated SQL:**
```sql
ALTER TABLE Todo ADD COLUMN priority INTEGER DEFAULT 1 NOT NULL;
```

### 3. Use New Field

```typescript
// Types are automatically updated!
await prisma.todo.create({
  data: {
    title: "High priority task",
    priority: 3  // ✅ TypeScript knows about this!
  }
});
```

## Prisma Studio

View and edit your schema visually:

```bash
npx prisma studio
```

Opens http://localhost:5555 where you can:
- See all models
- Browse data
- Add/edit/delete records
- See field types and attributes

## Common Schema Patterns

### Email Field
```prisma
email String @unique
```

### Enum Field
```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}

model User {
  id   Int  @id
  role Role @default(USER)
}
```

### JSON Field
```prisma
metadata Json?
```

```typescript
await prisma.user.create({
  data: {
    metadata: {
      theme: "dark",
      notifications: true
    }
  }
});
```

### Soft Delete Pattern
```prisma
model Todo {
  id        Int       @id
  title     String
  deletedAt DateTime?  // null = not deleted
}
```

```typescript
// Instead of deleting, mark as deleted
await prisma.todo.update({
  where: { id: 1 },
  data: { deletedAt: new Date() }
});

// Get only non-deleted
await prisma.todo.findMany({
  where: { deletedAt: null }
});
```

## Validation in Schema

Prisma schema handles structural validation:

```prisma
email String @unique  // Enforces uniqueness
age   Int             // Enforces integer type
```

But business logic validation (like "age must be 18+") goes in your DTOs:

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @Min(18)
  @Max(120)
  age: number;
}
```

## Schema Best Practices

1. **Always have an @id field**
   ```prisma
   id Int @id @default(autoincrement())
   ```

2. **Use timestamps**
   ```prisma
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   ```

3. **Name consistently**
   - Models: PascalCase (User, BlogPost)
   - Fields: camelCase (firstName, createdAt)

4. **Use appropriate types**
   - Prices: `Decimal` not `Float`
   - Big numbers: `BigInt` not `Int`
   - Text: `String` with `@db.Text` for long content

5. **Add indexes for frequently queried fields**
   ```prisma
   @@index([email])
   @@index([createdAt])
   ```

## Practice Exercise

Try adding these fields to the Todo model:

1. `priority` - Integer (1-5), defaults to 3
2. `dueDate` - Optional DateTime
3. `tags` - Optional String (will store comma-separated tags)

**Solution:**
```prisma
model Todo {
  id        Int       @id @default(autoincrement())
  title     String
  completed Boolean   @default(false)
  priority  Int       @default(3)
  dueDate   DateTime?
  tags      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

Then create the migration:
```bash
npx prisma migrate dev --name add_todo_fields
```

## What's Next?

In the next lesson, we'll explore Prisma Client - the generated TypeScript API you use to query your database. You'll learn all the CRUD operations and advanced querying techniques.
