import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';

@ApiTags('Users')
@Controller('users')
@UseGuards(new JwtAuthGuard(new Reflector()), RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() @ApiOperation({ summary: 'Get all users (admin)' })
  findAll(@Query('role') role?: string, @Query('search') search?: string) {
    return this.usersService.findAll({ role, search });
  }

  @Get('dashboard') @ApiOperation({ summary: 'Get dashboard stats (admin)' })
  getDashboardStats() { return this.usersService.getDashboardStats(); }

  @Get(':id') @ApiOperation({ summary: 'Get user by ID (admin)' })
  findOne(@Param('id') id: string) { return this.usersService.findOne(id); }

  @Patch(':id') @ApiOperation({ summary: 'Update user (admin)' })
  update(@Param('id') id: string, @Body() body: any) { return this.usersService.update(id, body); }

  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT) @ApiOperation({ summary: 'Delete user (admin)' })
  remove(@Param('id') id: string) { return this.usersService.remove(id); }
}
