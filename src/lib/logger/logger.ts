export type LogLevel = 'log' | 'warn' | 'error';

export type LogEntry = {
	id: number;
	level: LogLevel;
	message: string;
	timestamp: number;
};

const MAX_ENTRIES = 500;

let entries: LogEntry[] = [];
let nextId = 1;
let listeners: Array<() => void> = [];

const ANSI_RE = /\x1b\[[0-9;]*m/g;
const stripAnsi = (s: string) => s.replace(ANSI_RE, '');

const notify = () => {
	for (const fn of listeners) fn();
};

const push = (level: LogLevel, args: unknown[]) => {
	const message = stripAnsi(args
		.map((a) => {
			if (a instanceof Error) return `${a.message}\n${a.stack ?? ''}`;
			if (typeof a === 'object') {
				try {
					return JSON.stringify(a, null, 2);
				} catch {
					return String(a);
				}
			}
			return String(a);
		})
		.join(' '));

	entries.push({ id: nextId++, level, message, timestamp: Date.now() });

	if (entries.length > MAX_ENTRIES) {
		entries = entries.slice(-MAX_ENTRIES);
	}

	notify();
};

const origLog = console.log;
const origWarn = console.warn;
const origError = console.error;

let installed = false;

const logger = {
	install() {
		if (installed) return;
		installed = true;

		console.log = (...args: unknown[]) => {
			push('log', args);
			origLog(...args);
		};
		console.warn = (...args: unknown[]) => {
			push('warn', args);
			origWarn(...args);
		};
		console.error = (...args: unknown[]) => {
			push('error', args);
			origError(...args);
		};
	},

	log(...args: unknown[]) {
		push('log', args);
		origLog(...args);
	},
	warn(...args: unknown[]) {
		push('warn', args);
		origWarn(...args);
	},
	error(...args: unknown[]) {
		push('error', args);
		origError(...args);
	},

	getEntries(): LogEntry[] {
		return entries;
	},

	clear() {
		entries = [];
		nextId = 1;
		notify();
	},

	subscribe(fn: () => void) {
		listeners.push(fn);
		return () => {
			listeners = listeners.filter((l) => l !== fn);
		};
	}
};

export default logger;
