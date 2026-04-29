import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { BlogsModule } from './blogs/blogs.module';
import { DepartmentsModule } from './departments/departments.module';
import { PackagesModule } from './packages/packages.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    DoctorsModule,
    AppointmentsModule,
    BlogsModule,
    DepartmentsModule,
    PackagesModule,
    TestimonialsModule,
    StatsModule,
    UsersModule,
  ],
})
export class AppModule {}
