import type { DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import type { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import type { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error(
				'[ConfigService]The .env file could not be read or may be missing.',
			);
		} else {
			this.logger.log('[ConfigService] .env configuration has been loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
