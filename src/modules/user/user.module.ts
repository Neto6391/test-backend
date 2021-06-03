import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { usersProviders } from './users.providers';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [ forwardRef(()=> AuthModule)],
  providers: [
    ...usersProviders,
    UserService
  ],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
