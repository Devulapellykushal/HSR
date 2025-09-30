import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePersonDto, PersonResponseDto, UpdatePersonDto } from './dto/person.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @Roles('PARENT', 'ELDER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Add New Family Member',
    description: 'Create a new family member profile. Only PARENT and ELDER roles can add new members.',
    operationId: 'createFamilyMember'
  })
  @ApiBody({ 
    type: CreatePersonDto,
    description: 'Family member profile data',
    examples: {
      child: {
        summary: 'Add Child',
        description: 'Add a child family member',
        value: {
          name: 'Emma Johnson',
          nickname: 'Emmy',
          dob: '2015-06-15',
          relation: 'daughter',
          role: 'CHILD',
          contact: {
            phone: '+1234567890',
            email: 'emma@example.com'
          }
        }
      },
      elder: {
        summary: 'Add Elder',
        description: 'Add an elder family member',
        value: {
          name: 'Robert Johnson',
          nickname: 'Grandpa Bob',
          dob: '1950-03-20',
          relation: 'grandfather',
          role: 'ELDER',
          contact: {
            phone: '+1987654321',
            email: 'robert@example.com'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: ' Family member added successfully', 
    type: PersonResponseDto
  })
  @ApiResponse({ 
    status: 403, 
    description: ' Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
        error: { type: 'string', example: 'Forbidden' }
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
  async create(@Body() createPersonDto: CreatePersonDto, @Request() req) {
    return this.profilesService.create(createPersonDto, req.user.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get All Family Members',
    description: 'Retrieve all family members for the authenticated user\'s family.',
    operationId: 'getAllFamilyMembers'
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter by family member role',
    schema: { type: 'string', enum: ['PARENT', 'CHILD', 'ELDER'] }
  })
  @ApiQuery({
    name: 'relation',
    required: false,
    description: 'Filter by family relation',
    schema: { type: 'string', example: 'son' }
  })
  @ApiResponse({ 
    status: 200, 
    description: ' Family members retrieved successfully',
    type: [PersonResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: ' Unauthorized - Invalid or missing JWT token'
  })
  async findAll(@Request() req) {
    return this.profilesService.findAll(req.user.familyId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get Family Member by ID',
    description: 'Retrieve a specific family member by their unique ID.',
    operationId: 'getFamilyMemberById'
  })
  @ApiParam({
    name: 'id',
    description: 'Family member unique identifier',
    type: 'string',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiResponse({ 
    status: 200, 
    description: ' Family member retrieved successfully', 
    type: PersonResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: ' Family member not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Family member not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: ' Unauthorized - Invalid or missing JWT token'
  })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.profilesService.findOne(id, req.user.familyId);
  }

  @Patch(':id')
  @Roles('PARENT', 'ELDER')
  @ApiOperation({ 
    summary: 'Update Family Member',
    description: 'Update family member profile information. Only PARENT and ELDER roles can update profiles.',
    operationId: 'updateFamilyMember'
  })
  @ApiParam({
    name: 'id',
    description: 'Family member unique identifier',
    type: 'string',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiBody({ 
    type: UpdatePersonDto,
    description: 'Updated family member data',
    examples: {
      updateContact: {
        summary: 'Update Contact Info',
        description: 'Update contact information',
        value: {
          contact: {
            phone: '+1234567890',
            email: 'newemail@example.com'
          }
        }
      },
      updatePhoto: {
        summary: 'Update Photo',
        description: 'Update profile photo',
        value: {
          photoUrl: 'https://example.com/new-photo.jpg'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: ' Family member updated successfully', 
    type: PersonResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: ' Family member not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Family member not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: ' Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  async update(
    @Param('id') id: string, 
    @Body() updatePersonDto: UpdatePersonDto,
    @Request() req
  ) {
    return this.profilesService.update(id, updatePersonDto, req.user.familyId);
  }

  @Delete(':id')
  @Roles('PARENT')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete Family Member',
    description: 'Remove a family member from the family. Only PARENT role can delete members.',
    operationId: 'deleteFamilyMember'
  })
  @ApiParam({
    name: 'id',
    description: 'Family member unique identifier',
    type: 'string',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiResponse({ 
    status: 200, 
    description: ' Family member deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Family member deleted successfully' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: ' Family member not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Family member not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: ' Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  async remove(@Param('id') id: string, @Request() req) {
    await this.profilesService.remove(id, req.user.familyId);
    return { message: 'Family member deleted successfully' };
  }
}
