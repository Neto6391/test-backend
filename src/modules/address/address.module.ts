import { forwardRef, Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { addressProviders } from './address.providers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(()=> AuthModule),
  ],
  providers: [AddressService, ...addressProviders],
  controllers: [AddressController],
  exports: [AddressService]
})
export class AddressModule {}
