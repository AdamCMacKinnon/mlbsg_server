import { Test, TestingModule } from '@nestjs/testing';
import { PicksService } from './picks.service';

describe('PicksService', () => {
  let service: PicksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PicksService],
    }).compile();

    service = module.get<PicksService>(PicksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
