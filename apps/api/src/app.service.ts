import { Injectable } from '@nestjs/common';
import { HealthCheckResponse } from '@dcms/shared';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): import('@dcms/shared').HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'DCMS API is healthy',
    };
  }
}
