import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@ApiTags('Blogs')
@Controller('blogs')
@UseGuards(new JwtAuthGuard(new Reflector()), RolesGuard)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published blogs (public)' })
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.blogsService.findAll({ status, category, search });
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get blog by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get blog by ID (public)' })
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog (admin)' })
  create(@Body() body: any) {
    return this.blogsService.create(body);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog (admin)' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.blogsService.update(id, body);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog (admin)' })
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
