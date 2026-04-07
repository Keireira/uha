import { useState, useEffect } from 'react';
import { Settings } from 'react-native';
import { EventEmitter } from 'expo-modules-core';

import { eq } from 'drizzle-orm';
import { userTable } from '@db/schema';
import { silentDb } from '@db';

const settingsEmitter = new EventEmitter<Record<string, any>>();

const normalize = (value: any) => {
	return [0, 1].includes(value) ? value === 1 : value;
};

export const setSettingsValue = <T = any>(key: string, value: T) => {
	settingsEmitter.emit(key, value);
};

export const useSettingsValue = <T>(key: string): T => {
	const [value, setValue] = useState<T>(() => {
		let raw = Settings.get(key);

		return normalize(raw);
	});

	useEffect(() => {
		const subscription = settingsEmitter.addListener(key, (nextValue: T) => {
			console.log(key, nextValue);
			setValue(normalize(nextValue));

			Settings.set({ [key]: normalize(nextValue) });
			silentDb
				.update(userTable)
				.set({ [key]: nextValue })
				.where(eq(userTable.id, '00000000-0000-0000-0000-000000000000'))
				.execute();
		});

		return () => subscription.remove();
	}, [key]);

	return value;
};
