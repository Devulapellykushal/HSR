import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
    ApiConsumes,
    ApiOperation,
    ApiProduces,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Overall Health Check',
    description: 'Comprehensive health check including database connectivity and service status.',
    operationId: 'healthCheck'
  })
  @ApiResponse({ 
    status: 200, 
    description: ' Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        services: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'up' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 503, 
    description: ' Service is unhealthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'unhealthy' },
        timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        services: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'down' }
          }
        }
      }
    }
  })
  async check() {
    return this.healthService.check();
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Readiness Check',
    description: 'Kubernetes readiness probe endpoint. Checks if the service is ready to accept traffic.',
    operationId: 'readinessCheck'
  })
  @ApiResponse({ 
    status: 200, 
    description: ' Service is ready to accept traffic',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ready' },
        timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 503, 
    description: ' Service is not ready',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 503 },
        message: { type: 'string', example: 'Database is not ready' },
        error: { type: 'string', example: 'Service Unavailable' }
      }
    }
  })
  async ready() {
    return this.healthService.ready();
  }

  @Get('live')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Liveness Check',
    description: 'Kubernetes liveness probe endpoint. Checks if the service is alive and running.',
    operationId: 'livenessCheck'
  })
  @ApiResponse({ 
    status: 200, 
    description: ' Service is alive and running',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'alive' },
        timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
      }
    }
  })
  async live() {
    return this.healthService.live();
  }
}
