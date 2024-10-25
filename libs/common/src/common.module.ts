import { Module } from '@nestjs/common';
import { MetricsService } from './common.service';

@Module({
  providers: [MetricsService],
  exports: [MetricsService],
})
export class CommonModule { }
