import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Endpoint para verificar que la aplicación está funcionando',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicación funcionando correctamente',
    schema: {
      type: 'string',
      example: 'Ok!',
    },
  })
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
