import { PartialType } from '@nestjs/swagger';
import { CreateClothingSizeTypeDto } from './create-clothingsize-type.dto';

export class UpdateClothingSizeTypeDto extends PartialType(CreateClothingSizeTypeDto) {}