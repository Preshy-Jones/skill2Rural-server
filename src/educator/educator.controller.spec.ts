import { Test, TestingModule } from '@nestjs/testing';
import { EducatorController } from './educator.controller';
import { EducatorService } from './educator.service';

describe('EducatorController', () => {
  let controller: EducatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducatorController],
      providers: [EducatorService],
    }).compile();

    controller = module.get<EducatorController>(EducatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
