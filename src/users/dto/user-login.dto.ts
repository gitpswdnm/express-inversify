import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Wrong email type!' })
	email: string;

	@IsString({ message: 'Password is required!' })
	password: string;
}
