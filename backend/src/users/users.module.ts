import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Profile } from './entities/profile.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Role])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
