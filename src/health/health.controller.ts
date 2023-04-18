import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}

export default HealthController;
