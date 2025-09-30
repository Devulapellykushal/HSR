import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Kutum Family Companion API')
  .setDescription(`
    ## Family Companion Backend API
    
    A backend API for managing family data and profiles.
    
    ### Available Features:
    - **Authentication**: JWT-based user authentication with role-based access control
    - **Family Management**: Create and manage family member profiles and relationships
    - **System Health**: API health checks and system monitoring
    
    ### Authentication:
    Most endpoints require authentication. Use the **Authorize** button to set your JWT token.
    
    ### Rate Limiting:
    API requests are limited to 100 requests per minute per IP address.
    
    ### API Version:
    Current version: 1.0.0
  `)
  .setVersion('1.0.0')
  .setContact('Kutum Development Team', 'https://kutum.com', 'api-support@kutum.com')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .addServer('http://localhost:3000', 'Development Environment')
  .addServer('https://api.kutum.com', 'Production Environment')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token for authentication',
      in: 'header',
    },
    'JWT-auth',
  )
  .addTag('auth', 'Authentication & User Management')
  .addTag('profiles', 'Family Member Profiles')
  .addTag('health', 'System Health Monitoring')
  .addApiKey(
    {
      type: 'apiKey',
      name: 'X-API-Key',
      in: 'header',
      description: 'API Key for external integrations and third-party access',
    },
    'api-key',
  )
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    requestInterceptor: (req) => {
      req.headers['Content-Type'] = 'application/json';
      return req;
    },
    responseInterceptor: (res) => {
      return res;
    },
  },
  customSiteTitle: 'Kutum Family API Documentation',
  customfavIcon: '/favicon.ico',
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { 
      color: #1a1a1a; 
      font-weight: 600; 
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .swagger-ui .info .description { 
      color: #4a4a4a; 
      font-size: 1.1rem;
      line-height: 1.6;
    }
    .swagger-ui .scheme-container { 
      background: #f8f9fa; 
      padding: 15px; 
      border-radius: 8px; 
      border: 1px solid #e9ecef;
      margin: 20px 0;
    }
    .swagger-ui .btn.authorize { 
      background-color: #007bff; 
      border-color: #007bff; 
      border-radius: 4px;
      font-weight: 500;
    }
    .swagger-ui .btn.authorize:hover { 
      background-color: #0056b3; 
      border-color: #0056b3; 
    }
    .swagger-ui .opblock.opblock-post { 
      border-color: #28a745; 
      border-left: 4px solid #28a745;
    }
    .swagger-ui .opblock.opblock-get { 
      border-color: #007bff; 
      border-left: 4px solid #007bff;
    }
    .swagger-ui .opblock.opblock-put { 
      border-color: #ffc107; 
      border-left: 4px solid #ffc107;
    }
    .swagger-ui .opblock.opblock-patch { 
      border-color: #fd7e14; 
      border-left: 4px solid #fd7e14;
    }
    .swagger-ui .opblock.opblock-delete { 
      border-color: #dc3545; 
      border-left: 4px solid #dc3545;
    }
    .swagger-ui .opblock .opblock-summary { 
      font-weight: 500; 
    }
    .swagger-ui .opblock .opblock-summary-description { 
      color: #6c757d; 
      font-style: normal;
    }
    .swagger-ui .opblock .opblock-summary-path { 
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
      font-size: 14px;
    }
    .swagger-ui .opblock .opblock-summary-method { 
      font-weight: 600; 
      text-transform: uppercase;
      font-size: 12px;
    }
    .swagger-ui .info .base-url { 
      color: #6c757d; 
      font-size: 0.9rem;
    }
    .swagger-ui .info .title small { 
      color: #6c757d; 
      font-size: 0.8rem;
    }
  `,
};
