import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

const mockUsersRepository = () => ({
  findOne: jest.fn(),
  register: jest.fn(),
});

const mockUser = {
  username: 'adam',
  id: '12345',
  password: 'test',
  email: 'adam@adam.com',
  isactive: true,
  admin: true,
  pastchamp: false,
  diff: 0,
  createdAt: '2022-10-12 18:59:13.294-04',
  updatedAt: '2022-10-12 18:59:13.294-04',
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();
    authService = module.get(AuthService);
    usersRepository = module.get(UsersRepository);
  });
  describe('Register', () => {
    it('calls Users Repository and Registers new User', async () => {
      expect(mockUser).toBeDefined();
      usersRepository.register.mockResolvedValue(mockUser);
      const result = await usersRepository.register(mockUser);
      expect(usersRepository.register).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
    it('Error Case for Registering New User', async () => {
      usersRepository.register.mockResolvedValue(null);
      expect(authService.register(null)).rejects.toThrow(TypeError);
    });
  });
});
