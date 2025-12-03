import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

/**
 * TodoModule - Feature module for todo-related functionality
 *
 * What is a Module in NestJS?
 * - Modules organize your application into cohesive blocks
 * - Each feature typically has its own module (TodoModule, UserModule, etc.)
 * - Modules declare controllers, providers (services), and imports
 *
 * Module structure:
 * - controllers: Handle HTTP requests for this feature
 * - providers: Services that contain business logic
 * - imports: Other modules this module depends on
 * - exports: Providers to share with other modules
 *
 * Note: We don't need to import PrismaModule here because it's marked as @Global()
 * The PrismaService is automatically available for injection
 */
@Module({
  // Controllers that belong to this module
  // NestJS will register these routes with the application
  controllers: [TodoController],

  // Providers (services) that belong to this module
  // These can be injected into controllers and other services
  providers: [TodoService],
})
export class TodoModule {}
