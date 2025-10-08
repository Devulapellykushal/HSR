import { PartialType } from '@nestjs/swagger';
import { CreateShoesizeTypeDto } from './create-shoesize-type.dto';

export class UpdateShoesizeTypeDto extends PartialType(CreateShoesizeTypeDto) {}