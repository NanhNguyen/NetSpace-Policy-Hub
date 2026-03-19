import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('roles')
  async getAllRoles() {
    return this.usersService.getAllRoles();
  }

  @Get('profiles')
  async getAllProfiles() {
    return this.usersService.getAllProfiles();
  }

  @Get('profiles/:id')
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Post('create')
  async createUser(@Body() data: { email: string; full_name: string; role_id: number; password?: string }) {
    return this.usersService.createUser(data);
  }

  @Patch('roles/:id')
  async updateRole(@Param('id') id: string, @Body('role_id') roleId: number) {
    return this.usersService.updateRole(id, roleId);
  }
}
