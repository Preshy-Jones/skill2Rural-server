import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateEducatorDto } from './dto/create-educator.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiTags('Register User')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  
})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiTags('Register Educator')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @Post('educator')
  createEducator(@Body() createEducatorDto: CreateEducatorDto) {
    return this.userService.create(createEducatorDto);
  }

  @Patch(':id')
  @ApiTags('Update User')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Json structure for user object',
  })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // get logged in user
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Get Logged In User')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully retrieved.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  getLoggedInUser(@Request() req) {
    return req.user;
  }
}
