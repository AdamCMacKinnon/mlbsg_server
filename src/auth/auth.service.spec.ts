import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

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
  describe('Login', () => {
    it('Calls Login method and authenticates user', async () => {
      const username = 'adamcmack';
      usersRepository.findOne.mockResolvedValue(username);
      const user = await usersRepository.findOne({ username });
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(user).toBeDefined();
    });
    it('Case of null user value', async () => {
      const username = null;
      usersRepository.findOne.mockResolvedValue(null);
      const user = await usersRepository.findOne({ username });
      expect(user).toBe(null);
      expect(usersRepository.findOne(username)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
