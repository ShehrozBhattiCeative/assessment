import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@ApiTags('Doctors')
@Controller('doctors')
@UseGuards(new JwtAuthGuard(new Reflector()), RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all doctors (public)' })
  @ApiQuery({ name: 'specialty', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  findAll(
    @Query('specialty') specialty?: string,
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.doctorsService.findAll({ specialty, search, departmentId });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by ID (public)' })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create doctor (admin)' })
  create(@Body() body: any) {
    return this.doctorsService.create(body);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update doctor (admin)' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.doctorsService.update(id, body);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete doctor (admin)' })
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}
