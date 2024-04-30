import type { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import 'reflect-metadata';
import type { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import type { User } from './user.entity';
import type { IUsersRepository } from './users.repository.interface';
import { UsersService } from './users.service';
import type { IUsersService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};
const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	find: jest.fn(),
	getAll: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container
		.bind<IConfigService>(TYPES.ConfigService)
		.toConstantValue(ConfigServiceMock);
	container
		.bind<IUsersRepository>(TYPES.UsersRepository)
		.toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUsersService>(TYPES.UsersService);
});

let createdUser: UserModel | null;

describe('User service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'mock@mock.ru',
			name: 'MockName',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});
	it('validateUser - success', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'mock@mock.ru',
			name: 'MockName',
			password: '1',
		});
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'mock@mock.ru',
			password: '1',
		});
		expect(res).toBeTruthy();
	});
	it('validateUser - wrong password', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'mock@mock.ru',
			name: 'MockName',
			password: '1',
		});
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'mock@mock.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
	it('validateUser - not defined user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'mock1@mock.ru',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
