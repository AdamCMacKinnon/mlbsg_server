import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enums/roles.enum';
import { User } from './user.entity';

const mockUsersRepository = () => ({
  findOne: jest.fn(),
  register: jest.fn(),
});

const mockAuthService = () => ({
  findOne: jest.fn(),
  getUserById: jest.fn(),
});

export const mockUser = {
  username: 'adamcmack',
  id: '75571524-d685-4453-950c-822e58125b9e',
  password: 'test',
  email: 'adam@adam.com',
  isactive: true,
  role: Role.player,
  pastchamp: false,
  diff: 0,
  createdAt: '2022-10-12 18:59:13.294-04',
  updatedAt: '2022-10-12 18:59:13.294-04',
};

describe('AuthService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService;
  let usersRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UsersRepository,
          useFactory: mockUsersRepository,
        },
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
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
      expect(result.role).toEqual('player');
      expect(result).toEqual(mockUser);
    });
    it('Fails to register new User due to short username/password', async () => {
      const badUserObj = {
        username: 'bob',
        password: '1234',
        email: null,
      };
      usersRepository.register.mockResolvedValue(badUserObj);
      await usersRepository.register(badUserObj);
      expect(usersRepository.register).toHaveBeenCalled();
      expect(User).toThrowError();
    });
  });
  describe('Login', () => {
    it('Calls Login method and authenticates user', async () => {
      const username = mockUser.username;
      authService.findOne.mockResolvedValue(username);
      const userLogin = await authService.findOne({ username });
      expect(authService.findOne).toHaveBeenCalled();
      expect(userLogin).toBeDefined();
    });
    it('logs user in with email', async () => {
      const email = mockUser.email;
      authService.findOne.mockResolvedValue(email);
      const emailLogin = await authService.findOne({ email });
      expect(authService.findOne).toHaveBeenCalled();
      expect(emailLogin).toBeDefined();
    });
  });
  describe('getUserById', () => {
    it('finds user by id', async () => {
      const id = mockUser.id;
      authService.findOne.mockResolvedValue(id);
      const userById = await authService.findOne({ id });
      expect(authService.findOne).toHaveBeenCalled();
      expect(userById).toBeDefined();
    });
    it('should throw error when ID is null or undefined', async () => {
      const id = '123';
      const fakeId = await authService.findOne(id);
      expect(authService.findOne).toHaveBeenCalled();
      expect(fakeId).toBeUndefined();
    });
  });
});
