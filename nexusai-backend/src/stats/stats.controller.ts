import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Public() @Get() @ApiOperation({ summary: 'Get hospital statistics (public)' })
  getStats() { return this.statsService.getStats(); }
}
