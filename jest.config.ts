import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	preset: 'ts-jest',
	globals: {
		tsLog: {
			logLevel: 'info',
			prettyInspect: false,
		},
	},
};

export default config;
