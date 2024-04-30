import type { UserModel } from '@prisma/client';
import type { User } from './user.entity';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
	getAll: () => Promise<UserModel[] | null>;
}
