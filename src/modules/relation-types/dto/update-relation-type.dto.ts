import { PartialType } from '@nestjs/swagger';
import { CreateRelationTypeDto } from './create-relation-type.dto';

export class UpdateRelationTypeDto extends PartialType(CreateRelationTypeDto) {}