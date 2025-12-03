import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

/**
 * PrismaService extends PrismaClient to integrate with NestJS lifecycle
 *
 * Why extend PrismaClient?
 * - Allows us to use dependency injection with Prisma
 * - Gives us control over connection lifecycle (connect/disconnect)
 * - Makes it easy to inject the database client anywhere in the app
 *
 * Prisma 7+ Changes:
 * - Requires a driver adapter for database connections
 * - For SQLite, we use @prisma/adapter-better-sqlite3
 * - The adapter handles the low-level database communication
 *
 * Lifecycle Hooks:
 * - OnModuleInit: Called when the module is initialized (we connect to DB here)
 * - OnModuleDestroy: Called when the app shuts down (we disconnect here)
 */
@Injectable() // giving the functionality
// making a contract to implement specific functions
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Create the SQLite adapter with the database file path
    // The database URL can come from environment variable or default to dev.db
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || 'file:./dev.db',
    });

    // Pass the adapter to PrismaClient
    // This is required in Prisma 7+ for all database connections
    super({ adapter });
  }

  /**
   * Called automatically when the NestJS module initializes
   * We use this to establish the database connection
   */
  async onModuleInit() {
    // $connect() establishes the connection to the database
    // This is called lazily by Prisma, but calling it explicitly
    // ensures the connection is ready when the app starts
    await this.$connect();
  }

  /**
   * Called automatically when the application shuts down
   * We use this to gracefully close the database connection
   */
  async onModuleDestroy() {
    // $disconnect() closes all database connections
    // This prevents connection leaks and ensures clean shutdown
    await this.$disconnect();
  }
}
