import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, CreateUserDto, LoginDto, UserResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User Login',
    description: 'Authenticate user with email and password. Returns JWT token and user information.',
    operationId: 'loginUser'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      example1: {
        summary: 'Standard Login',
        description: 'Login with email and password',
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePassword123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful', 
    type: AuthResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'JWT token set in HTTP-only cookie',
        schema: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: ' Validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 429, 
    description: ' Too many requests',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 429 },
        message: { type: 'string', example: 'ThrottlerException: Too Many Requests' },
        error: { type: 'string', example: 'Too Many Requests' }
      }
    }
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'User Registration',
    description: 'Register a new user account. Creates user profile and returns JWT token.',
    operationId: 'registerUser'
  })
  @ApiBody({ 
    type: CreateUserDto,
    description: 'New user registration data',
    examples: {
      parent: {
        summary: 'Parent Registration',
        description: 'Register as a parent user',
        value: {
          email: 'parent@example.com',
          password: 'SecurePassword123!',
          familyId: '550e8400-e29b-41d4-a716-446655440000',
          role: 'PARENT'
        }
      },
      child: {
        summary: 'Child Registration',
        description: 'Register as a child user',
        value: {
          email: 'child@example.com',
          password: 'ChildPassword123!',
          familyId: '550e8400-e29b-41d4-a716-446655440000',
          role: 'CHILD'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: ' Registration successful', 
    type: AuthResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: ' User already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'User with this email already exists' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: ' Validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.register(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get User Profile',
    description: 'Retrieve current authenticated user profile information.',
    operationId: 'getUserProfile'
  })
  @ApiResponse({ 
    status: 200, 
    description: ' User profile retrieved successfully', 
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: ' Unauthorized - Invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: ' Forbidden - Insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return req.user;
  }
}
