import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

/**
 * UserModule - Feature module for user-related functionality
 *
 * Follows the same pattern as TodoModule:
 * - Declares the controller and service
 * - Exports UserService for potential use in other modules (like TodoModule)
 * - PrismaService is available globally, so no need to import PrismaModule
 */
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export for potential future use in other modules
})
export class UserModule {}
