# Validation and DTOs Guide

This document explains how input validation works in NestJS and why DTOs (Data Transfer Objects) are essential.

## What is a DTO?

A DTO (Data Transfer Object) is a class that defines the shape of data for a specific operation. DTOs:
- Define what fields are expected
- Specify validation rules
- Document the API contract
- Separate API layer from database layer

## Why Use DTOs?

### 1. Security
Without DTOs, users could send any data to your API:
```json
{ "title": "My Todo", "isAdmin": true, "internalId": 99999 }
```

With DTOs, only defined fields are accepted. Everything else is stripped or rejected.

### 2. Validation
DTOs ensure data is valid before it reaches your service:
```typescript
export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;  // Must be a non-empty string
}
```

### 3. Documentation
DTOs automatically generate Swagger documentation:
```typescript
@ApiProperty({
  description: 'The title of the todo',
  example: 'Buy groceries'
})
title: string;
```

## Setting Up Validation

### 1. Install Dependencies
```bash
npm install class-validator class-transformer
```

### 2. Enable ValidationPipe

In `main.ts`:
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Strip unknown properties
    transform: true,           // Transform to DTO instances
    forbidNonWhitelisted: true // Throw on unknown properties
  })
);
```

## Common Validation Decorators

### String Validations
```typescript
@IsString()          // Must be a string
@IsNotEmpty()        // Cannot be empty
@MinLength(3)        // At least 3 characters
@MaxLength(100)      // At most 100 characters
@IsEmail()           // Must be valid email
@Matches(/pattern/)  // Must match regex
```

### Number Validations
```typescript
@IsNumber()          // Must be a number
@IsInt()             // Must be an integer
@Min(0)              // Minimum value
@Max(100)            // Maximum value
@IsPositive()        // Must be positive
```

### Boolean Validations
```typescript
@IsBoolean()         // Must be true or false
```

### Optional Fields
```typescript
@IsOptional()        // Field is not required
```

### Array Validations
```typescript
@IsArray()           // Must be an array
@ArrayMinSize(1)     // At least 1 item
@ArrayMaxSize(10)    // At most 10 items
```

## Creating DTOs

### Create DTO
For creating new records:

```typescript
// src/todo/dto/create-todo.dto.ts
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the todo item',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Whether the todo is completed',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
```

### Update DTO
For partial updates, use `PartialType`:

```typescript
// src/todo/dto/update-todo.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
```

`PartialType` makes all fields optional - perfect for PATCH requests.

## Validation Error Responses

When validation fails, NestJS returns a 400 Bad Request:

```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "title must be a string"
  ],
  "error": "Bad Request"
}
```

## ValidationPipe Options Explained

```typescript
new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
})
```

### whitelist: true
Strips properties without decorators:
```json
// Input
{ "title": "Test", "hacker": "evil" }
// After whitelist
{ "title": "Test" }
```

### transform: true
Converts JSON to class instances and transforms types:
```typescript
// URL param comes as string "1"
@Param('id', ParseIntPipe) id: number  // Becomes number 1
```

### forbidNonWhitelisted: true
Throws error if unknown properties are sent:
```json
// Input with extra field
{ "title": "Test", "hacker": "evil" }
// Response: 400 Bad Request
{ "message": ["property hacker should not exist"] }
```

## Using DTOs in Controllers

```typescript
@Controller('todos')
export class TodoController {

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    // createTodoDto is validated and typed!
    return this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto
  ) {
    return this.todoService.update(id, updateTodoDto);
  }
}
```

## Swagger Integration

DTOs automatically appear in Swagger UI with:
- Field descriptions
- Example values
- Required/optional indicators
- Type information

Access Swagger at: http://localhost:3000/api

## Custom Validation

Create custom validators for complex rules:

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isWeekday', async: false })
export class IsWeekdayConstraint implements ValidatorConstraintInterface {
  validate(date: Date) {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  defaultMessage() {
    return 'Date must be a weekday';
  }
}

// Usage
@Validate(IsWeekdayConstraint)
dueDate: Date;
```

## Tips for Learning

1. **Start simple** - Use `@IsString()` and `@IsNotEmpty()` first
2. **Check Swagger** - See how your DTOs appear in the docs
3. **Test validation** - Send invalid data and check error messages
4. **Use PartialType** - Don't repeat yourself for update DTOs

## Further Reading

- [class-validator Documentation](https://github.com/typestack/class-validator)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [Swagger Decorators](https://docs.nestjs.com/openapi/decorators)
