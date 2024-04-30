import { IsEmail, IsString, Length } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Wrong email type!' })
	email: string;

	@Length(5, 12)
	@IsString({ message: 'Password is required!' })
	password: string;

	@Length(3, 20)
	@IsString({ message: 'Name is required!' })
	name: string;
}
