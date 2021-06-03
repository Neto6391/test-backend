import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { usersProviders } from './users.providers';

@Module({
  providers: [UserService, ...usersProviders],
  controllers: [UserController]
})
export class UserModule {}
