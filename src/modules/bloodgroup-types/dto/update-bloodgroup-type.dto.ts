import { PartialType } from '@nestjs/swagger';
import { CreateBloodGroupTypeDto } from './create-bloodgroup-type.dto';

export class UpdateBloodGroupTypeDto extends PartialType(CreateBloodGroupTypeDto) {}