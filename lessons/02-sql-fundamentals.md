# Lesson 2: SQL Fundamentals

## What is SQL?

**SQL** (Structured Query Language) is the language used to communicate with relational databases. It lets you:
- Create tables
- Insert data
- Retrieve data
- Update data
- Delete data

## Basic SQL Concepts

### Tables, Rows, and Columns

```
Table: Todo
┌────┬─────────────────┬───────────┬─────────────────────┬─────────────────────┐
│ id │ title           │ completed │ createdAt           │ updatedAt           │
├────┼─────────────────┼───────────┼─────────────────────┼─────────────────────┤
│ 1  │ Learn SQL       │ false     │ 2025-01-15 10:00:00 │ 2025-01-15 10:00:00 │
│ 2  │ Build API       │ true      │ 2025-01-15 11:00:00 │ 2025-01-15 14:30:00 │
└────┴─────────────────┴───────────┴─────────────────────┴─────────────────────┘
     ↑                  ↑           ↑
   Columns           Values       More columns
```

### Data Types

Common SQL data types:

| SQL Type | Description | Example |
|----------|-------------|---------|
| `INTEGER` | Whole numbers | 1, 42, -5 |
| `TEXT` / `VARCHAR` | Text strings | "Hello", "Learn SQL" |
| `BOOLEAN` | True or false | true, false |
| `REAL` / `FLOAT` | Decimal numbers | 3.14, 99.99 |
| `DATETIME` | Date and time | "2025-01-15 10:00:00" |

## The 5 Essential SQL Commands

### 1. CREATE TABLE - Define Structure

Creates a new table with specified columns.

```sql
CREATE TABLE Todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Breaking it down:**
- `id INTEGER PRIMARY KEY` - Unique identifier for each todo
- `AUTOINCREMENT` - Database automatically assigns next number
- `NOT NULL` - Field is required (can't be empty)
- `DEFAULT false` - If not specified, use false
- `DEFAULT CURRENT_TIMESTAMP` - Automatically set to current time

### 2. INSERT - Add Data

Adds new rows to a table.

```sql
-- Insert with all fields
INSERT INTO Todo (title, completed)
VALUES ('Learn SQL', false);

-- Insert with defaults (completed will be false)
INSERT INTO Todo (title)
VALUES ('Build an API');

-- Insert multiple rows
INSERT INTO Todo (title, completed)
VALUES
    ('Read docs', false),
    ('Write code', false),
    ('Test app', true);
```

**Result:**
```
Added 1 row: { id: 1, title: "Learn SQL", completed: false, ... }
```

### 3. SELECT - Retrieve Data

Queries data from the database.

```sql
-- Get all todos
SELECT * FROM Todo;

-- Get specific columns
SELECT id, title FROM Todo;

-- Get only completed todos
SELECT * FROM Todo WHERE completed = true;

-- Get todos sorted by creation date
SELECT * FROM Todo ORDER BY createdAt DESC;

-- Get one specific todo
SELECT * FROM Todo WHERE id = 1;

-- Search by title
SELECT * FROM Todo WHERE title LIKE '%API%';
```

**Results:**
```
┌────┬─────────────────┬───────────┐
│ id │ title           │ completed │
├────┼─────────────────┼───────────┤
│ 1  │ Learn SQL       │ false     │
│ 2  │ Build an API    │ true      │
└────┴─────────────────┴───────────┘
```

### 4. UPDATE - Modify Data

Changes existing rows.

```sql
-- Mark a todo as completed
UPDATE Todo
SET completed = true
WHERE id = 1;

-- Update title and mark complete
UPDATE Todo
SET title = 'Learn Advanced SQL',
    completed = true,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = 1;

-- Update all todos (be careful!)
UPDATE Todo
SET completed = true;
```

**Result:**
```
Updated 1 row
```

### 5. DELETE - Remove Data

Removes rows from a table.

```sql
-- Delete a specific todo
DELETE FROM Todo WHERE id = 1;

-- Delete all completed todos
DELETE FROM Todo WHERE completed = true;

-- Delete all todos (be very careful!)
DELETE FROM Todo;
```

**Result:**
```
Deleted 1 row
```

## SQL in Our Todo App

Here's what happens behind the scenes when you use our API:

### Create a Todo
**API Request:**
```bash
POST /todos
{ "title": "Buy groceries" }
```

**SQL Executed:**
```sql
INSERT INTO Todo (title, completed, createdAt, updatedAt)
VALUES ('Buy groceries', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

### Get All Todos
**API Request:**
```bash
GET /todos
```

**SQL Executed:**
```sql
SELECT * FROM Todo ORDER BY createdAt DESC;
```

### Get One Todo
**API Request:**
```bash
GET /todos/1
```

**SQL Executed:**
```sql
SELECT * FROM Todo WHERE id = 1;
```

### Update a Todo
**API Request:**
```bash
PATCH /todos/1
{ "completed": true }
```

**SQL Executed:**
```sql
UPDATE Todo
SET completed = true,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Delete a Todo
**API Request:**
```bash
DELETE /todos/1
```

**SQL Executed:**
```sql
DELETE FROM Todo WHERE id = 1;
```

## Primary Keys

A **Primary Key** uniquely identifies each row in a table.

```sql
CREATE TABLE Todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ...
);
```

**Rules:**
- Every table should have a primary key
- Primary key values must be unique
- Primary key cannot be NULL
- Usually an auto-incrementing integer

## WHERE Clauses

Filter which rows are affected by a query.

```sql
-- Exact match
WHERE id = 1
WHERE completed = true

-- Comparison operators
WHERE id > 5
WHERE id >= 10
WHERE id < 3
WHERE id <= 20
WHERE id != 1

-- Pattern matching
WHERE title LIKE '%SQL%'  -- Contains "SQL"
WHERE title LIKE 'Learn%'  -- Starts with "Learn"

-- Multiple conditions
WHERE completed = false AND id > 5
WHERE completed = true OR id = 1
```

## Common SQL Functions

```sql
-- Count rows
SELECT COUNT(*) FROM Todo;

-- Count completed todos
SELECT COUNT(*) FROM Todo WHERE completed = true;

-- Get current timestamp
SELECT CURRENT_TIMESTAMP;

-- String operations
SELECT UPPER(title) FROM Todo;  -- "LEARN SQL"
SELECT LOWER(title) FROM Todo;  -- "learn sql"
SELECT LENGTH(title) FROM Todo; -- 9
```

## Trying SQL Yourself

### Option 1: Prisma Studio
```bash
npx prisma studio
```
Click on "Query" tab to write SQL

### Option 2: SQLite CLI
```bash
# Open the database
sqlite3 dev.db

# Try some queries
sqlite> SELECT * FROM Todo;
sqlite> INSERT INTO Todo (title) VALUES ('Test SQL');
sqlite> .exit
```

### Option 3: Online SQL Practice
- [SQLBolt](https://sqlbolt.com/) - Interactive SQL tutorial
- [DB Fiddle](https://www.db-fiddle.com/) - Online SQL playground

## Common Mistakes to Avoid

1. **Forgetting WHERE in UPDATE/DELETE**
   ```sql
   -- DANGER: Updates ALL rows!
   UPDATE Todo SET completed = true;

   -- CORRECT: Updates one row
   UPDATE Todo SET completed = true WHERE id = 1;
   ```

2. **Forgetting quotes around strings**
   ```sql
   -- WRONG
   WHERE title = Learn SQL

   -- CORRECT
   WHERE title = 'Learn SQL'
   ```

3. **Using = instead of LIKE for pattern matching**
   ```sql
   -- WRONG: Exact match only
   WHERE title = '%SQL%'

   -- CORRECT: Pattern match
   WHERE title LIKE '%SQL%'
   ```

## Practice Exercises

Try writing SQL for these scenarios:

1. Create a table for blog posts with: id, title, content, published, publishedAt
2. Insert 3 blog posts
3. Get all published posts
4. Update a post's title
5. Delete unpublished posts

**Answers:**

```sql
-- 1. Create table
CREATE TABLE Post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT false,
    publishedAt DATETIME
);

-- 2. Insert posts
INSERT INTO Post (title, content, published)
VALUES
    ('First Post', 'Hello world', true),
    ('Draft Post', 'Work in progress', false),
    ('SQL Tutorial', 'Learn SQL basics', true);

-- 3. Get published posts
SELECT * FROM Post WHERE published = true;

-- 4. Update title
UPDATE Post SET title = 'My First Post' WHERE id = 1;

-- 5. Delete unpublished
DELETE FROM Post WHERE published = false;
```

## What's Next?

Now that you understand SQL, you'll learn about **Prisma** - a tool that writes these SQL queries for you! Instead of writing raw SQL, you'll use TypeScript code that's safer and easier to work with.
