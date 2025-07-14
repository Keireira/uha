// copied from axios repo https://github.com/axios/axios/blob/v1.x/lib/utils.js
export function forEach<T extends object>(
	obj: T | T[] | Record<string, T>,
	fn: (value: T, key: number | string, obj: T[] | Record<string, T>) => void,
	{ allOwnKeys = false } = {}
): void {
	// Don't bother if no value provided
	if (obj === null || typeof obj === 'undefined') {
		return;
	}

	let i;
	let l;

	// Force an array if not already something iterable
	if (typeof obj !== 'object') {
		/*eslint no-param-reassign:0*/
		obj = [obj];
	}

	if (Array.isArray(obj)) {
		// Iterate over array values
		for (i = 0, l = obj.length; i < l; i++) {
			fn.call(null, obj[i], i, obj);
		}
	} else {
		// Iterate over object keys
		const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
		const len = keys.length;
		let key;

		for (i = 0; i < len; i++) {
			key = keys[i];
			// @ts-ignore
			fn.call(null, obj[key], key, obj);
		}
	}
}

export function bind<T extends (...args: any[]) => any>(
	fn: T,
	thisArg: any
): (...args: Parameters<T>) => ReturnType<T> {
	return function wrap(...args: Parameters<T>) {
		return fn.apply(thisArg, args);
	};
}

export function extend<T extends Record<string, any>, U extends Record<string, any>>(
	a: T,
	b: U,
	thisArg?: any,
	{ allOwnKeys = false } = {}
): T & U {
	forEach(
		b,
		(val, key) => {
			if (thisArg && typeof val === 'function') {
				(a as any)[key] = bind(val, thisArg);
			} else {
				(a as any)[key] = val;
			}
		},
		{ allOwnKeys }
	);
	return a as T & U;
}
