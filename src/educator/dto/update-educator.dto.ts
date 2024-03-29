import { PartialType } from '@nestjs/swagger';
import { CreateEducatorDto } from './create-educator.dto';

export class UpdateEducatorDto extends PartialType(CreateEducatorDto) {}
