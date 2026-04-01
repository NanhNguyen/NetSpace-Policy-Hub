import { Module } from '@nestjs/common';
import { LarkController } from './lark.controller';
import { LarkService } from './lark.service';
import { UsersModule } from '../../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [LarkController],
  providers: [LarkService]
})
export class LarkModule {}
