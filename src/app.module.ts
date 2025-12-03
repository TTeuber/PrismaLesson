import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';

/**
 * AppModule - The root module of the NestJS application
 *
 * What is the AppModule?
 * - It's the entry point that ties all modules together
 * - NestJS starts here and loads all imported modules
 * - Think of it as the "main" configuration for your app
 *
 * Module loading order matters:
 * - PrismaModule is loaded first (global database access)
 * - UserModule provides user CRUD functionality
 * - TodoModule depends on PrismaModule and UserModule (but doesn't need to
 *   import them because PrismaModule is marked as @Global() and UserModule
 *   is only used for validation)
 *
 * Why keep AppController and AppService?
 * - They provide a simple health check endpoint (GET /)
 * - Useful for verifying the app is running
 */
@Module({
  // Import other modules to include their functionality
  imports: [
    PrismaModule, // Global database access - loaded first
    UserModule, // User CRUD functionality
    TodoModule, // Todo CRUD functionality
  ],

  // Controllers for this module (root-level routes)
  controllers: [AppController],

  // Services for this module
  providers: [AppService],
})
export class AppModule {}
