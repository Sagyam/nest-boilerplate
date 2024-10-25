import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TerminusModule } from '@nestjs/terminus';
import { AuthApiController } from './auth-api.controller';
import { AuthApiService } from './auth-api.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register(),
    TerminusModule,
  ],
  controllers: [AuthApiController],
  providers: [AuthApiService],
})
export class AuthApiModule { }
