import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule provides the PrismaService throughout the application
 *
 * @Global() decorator:
 * - Makes this module available everywhere without importing it in each module
 * - The PrismaService only needs to be provided once, then it's accessible globally
 * - This is the recommended pattern for database services in NestJS
 *
 * Without @Global(), you would need to:
 * 1. Import PrismaModule in every module that needs database access
 * 2. Or manually add PrismaService to providers in each module
 */
@Global()
@Module({
  // providers: Services that can be injected within this module
  providers: [PrismaService],

  // exports: Services that other modules can use when they import this module
  // Even with @Global(), we still need to export for the service to be injectable
  exports: [PrismaService],
})
export class PrismaModule {}
