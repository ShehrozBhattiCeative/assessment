import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Reflector } from '@nestjs/core';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(new JwtAuthGuard(new Reflector()), RolesGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get appointments (filtered by role)' })
  findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.appointmentsService.findAll(user, { status, patientId, doctorId });
  }

  @Get('stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Get appointment statistics (admin)' })
  getStats() {
    return this.appointmentsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single appointment' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.appointmentsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Book an appointment' })
  create(@Body() body: any, @CurrentUser() user: any) {
    return this.appointmentsService.create(body, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: any,
  ) {
    return this.appointmentsService.updateStatus(id, status, user);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete appointment (admin)' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.appointmentsService.remove(id, user);
  }
}
