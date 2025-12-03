# API Reference

Complete documentation for all Todo API endpoints.

## Base URL

```
http://localhost:3000
```

## Interactive Documentation

Visit **http://localhost:3000/api** for Swagger UI - you can test all endpoints directly in your browser!

---

## Endpoints

### GET /todos

Retrieve all todo items.

**Request:**
```bash
curl http://localhost:3000/todos
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Learn NestJS",
    "completed": true,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T14:20:00.000Z"
  },
  {
    "id": 2,
    "title": "Build an API",
    "completed": false,
    "createdAt": "2025-01-15T11:00:00.000Z",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
]
```

---

### GET /todos/:id

Retrieve a single todo by ID.

**Request:**
```bash
curl http://localhost:3000/todos/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Learn NestJS",
  "completed": true,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T14:20:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Todo with ID 999 not found",
  "error": "Not Found"
}
```

---

### POST /todos

Create a new todo item.

**Request:**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | The todo title (non-empty) |
| completed | boolean | No | Completion status (default: false) |

**Response:** `201 Created`
```json
{
  "id": 3,
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2025-01-15T15:00:00.000Z",
  "updatedAt": "2025-01-15T15:00:00.000Z"
}
```

**Validation Error:** `400 Bad Request`
```json
{
  "statusCode": 400,
  "message": ["title should not be empty", "title must be a string"],
  "error": "Bad Request"
}
```

---

### PATCH /todos/:id

Update an existing todo. Only send the fields you want to change.

**Request:**
```bash
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | No | New title |
| completed | boolean | No | New completion status |

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Learn NestJS",
  "completed": true,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T16:00:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Todo with ID 999 not found",
  "error": "Not Found"
}
```

---

### DELETE /todos/:id

Delete a todo item.

**Request:**
```bash
curl -X DELETE http://localhost:3000/todos/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Learn NestJS",
  "completed": true,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T16:00:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Todo with ID 999 not found",
  "error": "Not Found"
}
```

---

## Data Model

### Todo

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier (auto-generated) |
| title | string | The todo item title |
| completed | boolean | Whether the todo is done |
| createdAt | datetime | When the todo was created (ISO 8601) |
| updatedAt | datetime | When the todo was last modified (ISO 8601) |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (for POST requests) |
| 400 | Bad Request - Invalid input data |
| 404 | Not Found - Todo doesn't exist |
| 500 | Internal Server Error |

---

## Testing with curl

### Create multiple todos
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Task 1"}'

curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Task 2", "completed": true}'
```

### Get all todos
```bash
curl http://localhost:3000/todos
```

### Update a todo
```bash
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task", "completed": true}'
```

### Delete a todo
```bash
curl -X DELETE http://localhost:3000/todos/1
```

---

## Testing with HTTPie

If you prefer [HTTPie](https://httpie.io/):

```bash
# Get all
http GET localhost:3000/todos

# Create
http POST localhost:3000/todos title="New Todo"

# Update
http PATCH localhost:3000/todos/1 completed:=true

# Delete
http DELETE localhost:3000/todos/1
```

---

## Using Swagger UI

1. Start the server: `npm run start:dev`
2. Open http://localhost:3000/api
3. Click on any endpoint to expand it
4. Click "Try it out"
5. Fill in the parameters
6. Click "Execute"
7. View the response

Swagger UI is the easiest way to explore and test the API!
