require('dotenv').config();

class AppConfig {
	private localEnv: Record<string, string> = {};

	constructor(env: Record<string, string>, keys: string[]) {
		for (const key of keys) {
			if (!env[key]) {
				throw new Error(`Configuration error - missing env.${key}`);
			}
			this.localEnv[key] = env[key];
		}
	}

	getValue(key: string): string {
		return this.localEnv[key];
	}
}

export const appConfig = new AppConfig(process.env, [
	'POSTGRES_USERNAME',
	'POSTGRES_PASSWORD',
	'POSTGRES_DATABASE',
	'POSTGRES_PORT',
	'SESSION_SECRET',
	'SUPERUSER_USERNAME',
	'SUPERUSER_PASSWORD',
]);
