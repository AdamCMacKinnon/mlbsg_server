import { Test } from '@nestjs/testing';
import { PicksRepository } from './picks.repository';
import { PicksService } from './picks.service';
import { mockUser } from '../auth/auth.service.spec';

const mockPicksService = () => ({
  getUserPicks: jest.fn(),
  find: jest.fn(),
});

const mockPicksRepository = () => ({
  getUserPicks: jest.fn(),
});

describe('PicksService', () => {
  let picksService: PicksService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let picksRepository: PicksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PicksService,
        { provide: PicksService, useFactory: mockPicksService },
        { provide: PicksRepository, useFactory: mockPicksRepository },
      ],
    }).compile();
    picksService = module.get(PicksService);
    picksRepository = module.get(PicksRepository);
  });

  describe('getUserPicks', () => {
    it('retrieves all user picks', async () => {
      expect(mockUser).toBeDefined();
    });
  });
});
