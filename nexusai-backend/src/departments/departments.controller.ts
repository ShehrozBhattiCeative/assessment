import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@ApiTags('Departments')
@Controller('departments')
@UseGuards(new JwtAuthGuard(new Reflector()), RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Public() @Get() @ApiOperation({ summary: 'Get all departments (public)' })
  findAll() { return this.departmentsService.findAll(); }

  @Public() @Get(':id') @ApiOperation({ summary: 'Get department by ID (public)' })
  findOne(@Param('id') id: string) { return this.departmentsService.findOne(id); }

  @Post() @Roles('admin') @ApiBearerAuth() @ApiOperation({ summary: 'Create department (admin)' })
  create(@Body() body: any) { return this.departmentsService.create(body); }

  @Patch(':id') @Roles('admin') @ApiBearerAuth() @ApiOperation({ summary: 'Update department (admin)' })
  update(@Param('id') id: string, @Body() body: any) { return this.departmentsService.update(id, body); }

  @Delete(':id') @Roles('admin') @HttpCode(HttpStatus.NO_CONTENT) @ApiBearerAuth() @ApiOperation({ summary: 'Delete department (admin)' })
  remove(@Param('id') id: string) { return this.departmentsService.remove(id); }
}
