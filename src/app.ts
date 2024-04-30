import { json } from 'body-parser';
import type { Express } from 'express';
import express from 'express';
import type { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { AuthMiddleware } from './common/auth.middleware';
import type { IConfigService } from './config/config.service.interface';
import type { PrismaService } from './database/prisma.service';
import type { IExceptionFilter } from './errors/exception.filter.interface';
import type { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import type { UsersController } from './users/users.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private userController: UsersController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 3005;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`SERVER is running on http://localhost:${this.port}`);
		// console.log(`SERVER is running on http://localhost:${this.port}`)
	}

	public close(): void {
		this.server.close();
	}
}
