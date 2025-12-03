# Lesson 1: What is a Database?

## Introduction

A **database** is an organized collection of data that can be easily accessed, managed, and updated. Think of it like a digital filing cabinet where you store information in a structured way.

## Why Do We Need Databases?

Imagine you're building a todo app. Where do you store the todos? You could:

1. **Keep them in memory (variables)** - But they disappear when you restart the app ❌
2. **Save to a text file** - But searching and updating is slow ❌
3. **Use a database** - Fast, persistent, organized ✅

## Real-World Examples

- **Instagram** - Database stores users, posts, comments, likes
- **Amazon** - Database stores products, orders, customers
- **Your Todo App** - Database stores todo items with titles and completion status

## Types of Databases

### 1. Relational Databases (SQL)
Data is organized in **tables** (like spreadsheets) with rows and columns.

**Examples:** PostgreSQL, MySQL, SQLite

```
Todos Table:
┌────┬─────────────────┬───────────┐
│ id │ title           │ completed │
├────┼─────────────────┼───────────┤
│ 1  │ Learn databases │ false     │
│ 2  │ Build an app    │ true      │
└────┴─────────────────┴───────────┘
```

### 2. NoSQL Databases
Data is stored in flexible formats (documents, key-value pairs, etc.)

**Examples:** MongoDB, Redis, DynamoDB

```json
{
  "id": 1,
  "title": "Learn databases",
  "completed": false
}
```

## Our Project Uses SQLite

**SQLite** is a relational database that:
- Stores data in a single file (`dev.db`)
- Doesn't require a server
- Is perfect for learning and small applications
- Uses SQL (Structured Query Language)

## Key Database Concepts

### 1. Tables
A table stores data about one type of thing (like todos, users, products).

### 2. Rows (Records)
Each row represents one item in the table.

```
One row = One todo item
```

### 3. Columns (Fields)
Each column represents one piece of information about the item.

```
Columns: id, title, completed, createdAt, updatedAt
```

### 4. Schema
The **schema** defines the structure of your database:
- What tables exist
- What columns each table has
- What data type each column stores
- Rules and constraints

## Visualizing Our Todo Database

```
Database: dev.db
│
└── Table: Todo
    ├── Column: id (integer, unique)
    ├── Column: title (text)
    ├── Column: completed (boolean)
    ├── Column: createdAt (timestamp)
    └── Column: updatedAt (timestamp)
```

## How Applications Use Databases

```
Your Application
       ↕
   Database

1. App sends a query: "Give me all todos"
2. Database searches and returns data
3. App displays the todos to the user
4. User marks a todo complete
5. App sends update: "Set todo #1 completed = true"
6. Database saves the change
```

## Benefits of Using Databases

1. **Persistence** - Data survives app restarts
2. **Organization** - Structured storage with clear relationships
3. **Speed** - Optimized for fast searching and filtering
4. **Concurrent Access** - Multiple users can access simultaneously
5. **Data Integrity** - Rules ensure data stays valid

## What You'll Learn Next

In the next lesson, we'll learn **SQL** - the language used to interact with relational databases. You'll write queries to create, read, update, and delete data.

## Quick Quiz

1. What's the difference between a table and a row?
2. Why can't we just store all data in variables?
3. What type of database is SQLite?
4. Name one benefit of using a database.

**Answers:**
1. A table is the structure that holds data; a row is one record in that table
2. Variables are stored in memory and disappear when the app restarts
3. Relational database (SQL)
4. Persistence, organization, speed, concurrent access, or data integrity
