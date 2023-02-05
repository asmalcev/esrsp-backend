export enum LogType {
	'COMMON',
	'DEBUG',
}

export type WriteLogType = {
	msg: string;
	type?: LogType;
	session: Record<string, any>;
};
