import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap function - Entry point of the NestJS application
 *
 * This function:
 * 1. Creates the NestJS application instance
 * 2. Configures global middleware (validation, swagger)
 * 3. Starts the HTTP server
 */
async function bootstrap() {
  // Create the NestJS application from the root AppModule
  const app = await NestFactory.create(AppModule);

  /**
   * Global Validation Pipe Configuration
   *
   * ValidationPipe automatically validates incoming requests against DTOs
   *
   * Options explained:
   * - whitelist: true
   *   Strips any properties that don't have decorators in the DTO
   *   Prevents users from sending extra/malicious fields
   *
   * - transform: true
   *   Automatically transforms payloads to DTO class instances
   *   Also converts primitive types (e.g., string "1" to number 1)
   *
   * - forbidNonWhitelisted: true
   *   Throws an error if non-whitelisted properties are present
   *   Instead of silently stripping them, it returns 400 Bad Request
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * Swagger/OpenAPI Configuration
   *
   * Swagger provides interactive API documentation at /api
   * Users can test endpoints directly from the browser
   *
   * DocumentBuilder creates the OpenAPI specification:
   * - setTitle: API name shown in the docs
   * - setDescription: Brief description of what the API does
   * - setVersion: API version for tracking changes
   * - build: Generates the final configuration object
   */
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('A simple CRUD API for managing todo items')
    .setVersion('1.0')
    .build();

  // Create the Swagger document from our app and config
  const document = SwaggerModule.createDocument(app, config);

  // Mount Swagger UI at /api endpoint
  // Visit http://localhost:3000/api to see the interactive docs
  SwaggerModule.setup('api', app, document);

  // Start the server on port 3000 (or PORT env variable)
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Log the URLs for easy access
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
