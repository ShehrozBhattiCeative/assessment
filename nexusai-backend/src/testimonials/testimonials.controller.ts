import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Public() @Get() @ApiOperation({ summary: 'Get all active testimonials (public)' })
  findAll() { return this.testimonialsService.findAll(); }
}
