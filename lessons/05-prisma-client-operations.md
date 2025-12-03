# Lesson 5: Prisma Client CRUD Operations

## What is Prisma Client?

Prisma Client is the auto-generated, type-safe database client. After defining your schema, Prisma generates all the code you need to query your database.

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Now you can use prisma.todo, prisma.user, etc.
// One property for each model in your schema
```

## Generate Prisma Client

```bash
# Generate client from schema
npx prisma generate

# Also runs automatically with:
npx prisma migrate dev
```

## CRUD Operations

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete

### CREATE - Adding Data

#### create() - Add One Record

```typescript
const todo = await prisma.todo.create({
  data: {
    title: 'Learn Prisma',
    completed: false
  }
});

console.log(todo);
// {
//   id: 1,
//   title: 'Learn Prisma',
//   completed: false,
//   createdAt: 2025-01-15T10:00:00.000Z,
//   updatedAt: 2025-01-15T10:00:00.000Z
// }
```

**SQL Generated:**
```sql
INSERT INTO Todo (title, completed, createdAt, updatedAt)
VALUES ('Learn Prisma', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

#### With Defaults

```typescript
// completed, createdAt, updatedAt use defaults
const todo = await prisma.todo.create({
  data: {
    title: 'Build API'
  }
});
// completed = false (default)
// createdAt = now()
// updatedAt = now()
```

#### createMany() - Add Multiple Records

```typescript
const result = await prisma.todo.createMany({
  data: [
    { title: 'Task 1' },
    { title: 'Task 2' },
    { title: 'Task 3' }
  ]
});

console.log(result);
// { count: 3 }
```

**SQL Generated:**
```sql
INSERT INTO Todo (title, completed, createdAt, updatedAt)
VALUES
  ('Task 1', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Task 2', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Task 3', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

### READ - Retrieving Data

#### findMany() - Get Multiple Records

```typescript
// Get all todos
const todos = await prisma.todo.findMany();

// Get todos with filter
const completed = await prisma.todo.findMany({
  where: {
    completed: true
  }
});

// Get with ordering
const sorted = await prisma.todo.findMany({
  orderBy: {
    createdAt: 'desc'  // newest first
  }
});

// Get with limit
const first10 = await prisma.todo.findMany({
  take: 10
});

// Get with offset (pagination)
const page2 = await prisma.todo.findMany({
  skip: 10,
  take: 10
});

// Select specific fields
const titlesOnly = await prisma.todo.findMany({
  select: {
    id: true,
    title: true
  }
});
// Returns: [{ id: 1, title: "..." }, ...]
```

**SQL Examples:**
```sql
-- findMany()
SELECT * FROM Todo;

-- where filter
SELECT * FROM Todo WHERE completed = true;

-- orderBy
SELECT * FROM Todo ORDER BY createdAt DESC;

-- take (limit)
SELECT * FROM Todo LIMIT 10;

-- skip + take (pagination)
SELECT * FROM Todo LIMIT 10 OFFSET 10;

-- select
SELECT id, title FROM Todo;
```

#### findUnique() - Get One Record by Unique Field

```typescript
// Find by ID (primary key)
const todo = await prisma.todo.findUnique({
  where: {
    id: 1
  }
});

// Returns null if not found
if (!todo) {
  console.log('Todo not found');
}
```

**SQL Generated:**
```sql
SELECT * FROM Todo WHERE id = 1 LIMIT 1;
```

#### findFirst() - Get First Matching Record

```typescript
// Get first incomplete todo
const todo = await prisma.todo.findFirst({
  where: {
    completed: false
  },
  orderBy: {
    createdAt: 'asc'
  }
});
```

**SQL Generated:**
```sql
SELECT * FROM Todo
WHERE completed = false
ORDER BY createdAt ASC
LIMIT 1;
```

#### count() - Count Records

```typescript
// Count all todos
const total = await prisma.todo.count();

// Count with filter
const completedCount = await prisma.todo.count({
  where: {
    completed: true
  }
});
```

**SQL Generated:**
```sql
-- count()
SELECT COUNT(*) FROM Todo;

-- with filter
SELECT COUNT(*) FROM Todo WHERE completed = true;
```

### UPDATE - Modifying Data

#### update() - Update One Record

```typescript
const updated = await prisma.todo.update({
  where: {
    id: 1
  },
  data: {
    completed: true
  }
});

// updatedAt is automatically set!
```

**SQL Generated:**
```sql
UPDATE Todo
SET completed = true, updatedAt = CURRENT_TIMESTAMP
WHERE id = 1;
```

**Error if not found:**
```typescript
try {
  await prisma.todo.update({
    where: { id: 999 },
    data: { completed: true }
  });
} catch (error) {
  // Record not found error
}
```

#### updateMany() - Update Multiple Records

```typescript
const result = await prisma.todo.updateMany({
  where: {
    completed: false
  },
  data: {
    completed: true
  }
});

console.log(result);
// { count: 5 }  // Number of updated records
```

**SQL Generated:**
```sql
UPDATE Todo
SET completed = true, updatedAt = CURRENT_TIMESTAMP
WHERE completed = false;
```

#### upsert() - Update or Create

```typescript
// Update if exists, create if doesn't
const todo = await prisma.todo.upsert({
  where: {
    id: 1
  },
  update: {
    completed: true
  },
  create: {
    title: 'New Todo',
    completed: true
  }
});
```

**SQL Logic:**
```sql
-- Check if exists
SELECT * FROM Todo WHERE id = 1;

-- If found: UPDATE
UPDATE Todo SET completed = true WHERE id = 1;

-- If not found: INSERT
INSERT INTO Todo (title, completed) VALUES ('New Todo', true);
```

### DELETE - Removing Data

#### delete() - Delete One Record

```typescript
const deleted = await prisma.todo.delete({
  where: {
    id: 1
  }
});

// Returns the deleted record
console.log(deleted);
```

**SQL Generated:**
```sql
DELETE FROM Todo WHERE id = 1;
```

**Error if not found:**
```typescript
try {
  await prisma.todo.delete({
    where: { id: 999 }
  });
} catch (error) {
  // Record not found error
}
```

#### deleteMany() - Delete Multiple Records

```typescript
// Delete all completed todos
const result = await prisma.todo.deleteMany({
  where: {
    completed: true
  }
});

console.log(result);
// { count: 3 }  // Number of deleted records

// Delete all (be careful!)
const allDeleted = await prisma.todo.deleteMany();
```

**SQL Generated:**
```sql
-- with filter
DELETE FROM Todo WHERE completed = true;

-- delete all
DELETE FROM Todo;
```

## Advanced Filtering (WHERE Clauses)

### Comparison Operators

```typescript
// Equals
await prisma.todo.findMany({
  where: { completed: true }
});

// Not equals
await prisma.todo.findMany({
  where: { completed: { not: true } }
});

// Greater than / Less than (numbers, dates)
await prisma.todo.findMany({
  where: {
    id: { gt: 5 }      // greater than
    // lt: 5           // less than
    // gte: 5          // greater than or equal
    // lte: 5          // less than or equal
  }
});

// In array
await prisma.todo.findMany({
  where: {
    id: { in: [1, 2, 3, 4, 5] }
  }
});

// Not in array
await prisma.todo.findMany({
  where: {
    id: { notIn: [1, 2, 3] }
  }
});
```

### String Filtering

```typescript
// Contains (case-sensitive in some databases)
await prisma.todo.findMany({
  where: {
    title: { contains: 'Prisma' }
  }
});

// Starts with
await prisma.todo.findMany({
  where: {
    title: { startsWith: 'Learn' }
  }
});

// Ends with
await prisma.todo.findMany({
  where: {
    title: { endsWith: 'API' }
  }
});

// Case-insensitive (mode: 'insensitive')
await prisma.todo.findMany({
  where: {
    title: {
      contains: 'prisma',
      mode: 'insensitive'
    }
  }
});
```

**SQL Generated:**
```sql
-- contains
SELECT * FROM Todo WHERE title LIKE '%Prisma%';

-- startsWith
SELECT * FROM Todo WHERE title LIKE 'Learn%';

-- endsWith
SELECT * FROM Todo WHERE title LIKE '%API';
```

### Combining Conditions (AND, OR, NOT)

```typescript
// AND (implicit)
await prisma.todo.findMany({
  where: {
    completed: false,
    title: { contains: 'urgent' }
  }
});

// AND (explicit)
await prisma.todo.findMany({
  where: {
    AND: [
      { completed: false },
      { title: { contains: 'urgent' } }
    ]
  }
});

// OR
await prisma.todo.findMany({
  where: {
    OR: [
      { completed: true },
      { title: { contains: 'important' } }
    ]
  }
});

// NOT
await prisma.todo.findMany({
  where: {
    NOT: {
      completed: true
    }
  }
});

// Complex combination
await prisma.todo.findMany({
  where: {
    AND: [
      { completed: false },
      {
        OR: [
          { title: { contains: 'urgent' } },
          { title: { contains: 'important' } }
        ]
      }
    ]
  }
});
```

**SQL Generated:**
```sql
-- AND
SELECT * FROM Todo
WHERE completed = false AND title LIKE '%urgent%';

-- OR
SELECT * FROM Todo
WHERE completed = true OR title LIKE '%important%';

-- Complex
SELECT * FROM Todo
WHERE completed = false
  AND (title LIKE '%urgent%' OR title LIKE '%important%');
```

### Null Values

```typescript
// Assuming dueDate is optional: dueDate DateTime?

// Find todos with no due date
await prisma.todo.findMany({
  where: {
    dueDate: null
  }
});

// Find todos with a due date
await prisma.todo.findMany({
  where: {
    dueDate: { not: null }
  }
});
```

## Sorting (ORDER BY)

```typescript
// Single field
await prisma.todo.findMany({
  orderBy: {
    createdAt: 'desc'
  }
});

// Multiple fields
await prisma.todo.findMany({
  orderBy: [
    { completed: 'asc' },   // completed todos last
    { createdAt: 'desc' }   // within each group, newest first
  ]
});
```

## Pagination

### Offset-based Pagination

```typescript
const page = 2;
const perPage = 10;

const todos = await prisma.todo.findMany({
  skip: (page - 1) * perPage,  // Skip first 10
  take: perPage,                // Take next 10
  orderBy: { createdAt: 'desc' }
});

// Get total for pagination info
const total = await prisma.todo.count();
const totalPages = Math.ceil(total / perPage);
```

### Cursor-based Pagination

```typescript
const todos = await prisma.todo.findMany({
  take: 10,
  cursor: {
    id: lastSeenId
  },
  skip: 1,  // Skip the cursor itself
  orderBy: { id: 'asc' }
});
```

## Select vs Include

### select - Choose Specific Fields

```typescript
const todos = await prisma.todo.findMany({
  select: {
    id: true,
    title: true
    // completed, createdAt, updatedAt not returned
  }
});
// [{ id: 1, title: "..." }, ...]
```

### include - Include Relations

```typescript
// If you had User -> Todo relationship:
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    todos: true  // Include all user's todos
  }
});
// {
//   id: 1,
//   email: "...",
//   todos: [{ id: 1, title: "..." }, ...]
// }
```

## Transactions

Execute multiple operations atomically:

```typescript
// All succeed or all fail
const result = await prisma.$transaction([
  prisma.todo.create({ data: { title: 'Task 1' } }),
  prisma.todo.create({ data: { title: 'Task 2' } }),
  prisma.todo.update({ where: { id: 1 }, data: { completed: true } })
]);
```

### Interactive Transactions

```typescript
const result = await prisma.$transaction(async (tx) => {
  // All operations use tx instead of prisma
  const todo = await tx.todo.create({
    data: { title: 'New Task' }
  });

  const count = await tx.todo.count();

  if (count > 100) {
    throw new Error('Too many todos!');
    // Transaction will rollback
  }

  return { todo, count };
});
```

## Raw SQL

When you need custom SQL:

```typescript
// Raw query (SELECT)
const todos = await prisma.$queryRaw`
  SELECT * FROM Todo
  WHERE title LIKE ${'%Prisma%'}
  ORDER BY createdAt DESC
`;

// Raw execute (INSERT, UPDATE, DELETE)
await prisma.$executeRaw`
  UPDATE Todo
  SET completed = true
  WHERE createdAt < ${someDate}
`;

// Unsafe (use carefully!)
const tableName = 'Todo';
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM ${tableName}`
);
```

## Error Handling

```typescript
import { Prisma } from '@prisma/client';

try {
  await prisma.todo.create({
    data: { title: 'New Task' }
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (error.code === 'P2002') {
      console.log('This value already exists');
    }

    // P2025: Record not found
    if (error.code === 'P2025') {
      console.log('Record not found');
    }
  }
  throw error;
}
```

## Best Practices

### 1. Always Reuse PrismaClient Instance

```typescript
// ❌ BAD: Creates new client every time
function getTodos() {
  const prisma = new PrismaClient();
  return prisma.todo.findMany();
}

// ✅ GOOD: Reuse single instance
const prisma = new PrismaClient();

function getTodos() {
  return prisma.todo.findMany();
}
```

### 2. Handle Record Not Found

```typescript
// With findUnique
const todo = await prisma.todo.findUnique({
  where: { id: 1 }
});

if (!todo) {
  throw new NotFoundException('Todo not found');
}

// Or use update/delete which throw automatically
try {
  await prisma.todo.update({
    where: { id: 999 },
    data: { completed: true }
  });
} catch (error) {
  // Handle error
}
```

### 3. Use Transactions for Related Operations

```typescript
// ✅ GOOD: Atomic operation
await prisma.$transaction([
  prisma.user.create({ data: { email: 'test@example.com' } }),
  prisma.todo.create({ data: { title: 'Task', userId: 1 } })
]);
```

### 4. Use Select to Reduce Data Transfer

```typescript
// ❌ BAD: Returns all fields even if not needed
const todos = await prisma.todo.findMany();

// ✅ GOOD: Only get what you need
const todos = await prisma.todo.findMany({
  select: {
    id: true,
    title: true,
    completed: true
  }
});
```

## Practice Exercises

Try these operations:

1. Create 3 todos with different titles
2. Find all incomplete todos
3. Update todo #1 to be completed
4. Count how many completed todos there are
5. Delete all completed todos
6. Find todos where title contains "API"

**Solutions:**

```typescript
// 1. Create
await prisma.todo.createMany({
  data: [
    { title: 'Learn Prisma' },
    { title: 'Build API' },
    { title: 'Write tests' }
  ]
});

// 2. Find incomplete
const incomplete = await prisma.todo.findMany({
  where: { completed: false }
});

// 3. Update
await prisma.todo.update({
  where: { id: 1 },
  data: { completed: true }
});

// 4. Count completed
const count = await prisma.todo.count({
  where: { completed: true }
});

// 5. Delete completed
await prisma.todo.deleteMany({
  where: { completed: true }
});

// 6. Find by title
const apiTodos = await prisma.todo.findMany({
  where: {
    title: { contains: 'API' }
  }
});
```

## What's Next?

You now understand the core Prisma operations! In the next lesson, we'll put it all together by walking through real examples from this project and see how Prisma integrates with NestJS.
