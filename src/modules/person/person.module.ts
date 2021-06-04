import { forwardRef, Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { AuthModule } from '../auth/auth.module';
import { personsProviders } from './person.providers';

@Module({
  imports: [ forwardRef(()=> AuthModule)],
  providers: [PersonService, ...personsProviders],
  controllers: [PersonController]
})
export class PersonModule {}
