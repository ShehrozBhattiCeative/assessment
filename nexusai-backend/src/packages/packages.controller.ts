import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@ApiTags('Packages')
@Controller('packages')
@UseGuards(new JwtAuthGuard(new Reflector()), RolesGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public() @Get() @ApiOperation({ summary: 'Get active packages (public)' })
  findAll() { return this.packagesService.findAll(); }

  @Get('all') @Roles('admin') @ApiBearerAuth() @ApiOperation({ summary: 'Get all packages including inactive (admin)' })
  findAllAdmin() { return this.packagesService.findAllAdmin(); }

  @Public() @Get(':id') @ApiOperation({ summary: 'Get package by ID (public)' })
  findOne(@Param('id') id: string) { return this.packagesService.findOne(id); }

  @Post() @Roles('admin') @ApiBearerAuth() @ApiOperation({ summary: 'Create package (admin)' })
  create(@Body() body: any) { return this.packagesService.create(body); }

  @Patch(':id') @Roles('admin') @ApiBearerAuth() @ApiOperation({ summary: 'Update package (admin)' })
  update(@Param('id') id: string, @Body() body: any) { return this.packagesService.update(id, body); }

  @Delete(':id') @Roles('admin') @HttpCode(HttpStatus.NO_CONTENT) @ApiBearerAuth() @ApiOperation({ summary: 'Delete package (admin)' })
  remove(@Param('id') id: string) { return this.packagesService.remove(id); }
}
