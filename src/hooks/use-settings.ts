import { useState, useEffect } from 'react';
import { Settings } from 'react-native';
import { EventEmitter } from 'expo-modules-core';

const settingsEmitter = new EventEmitter<Record<string, any>>();

const normalize = (value: any) => {
	return [0, 1].includes(value) ? value === 1 : value;
};

export const setSettingsValue = (key: string, value: any) => {
	Settings.set({ [key]: value });

	settingsEmitter.emit(key, value);
};

export const useSettingsValue = <T>(key: string): T => {
	const [value, setValue] = useState<T>(() => {
		const raw = Settings.get(key);

		return normalize(raw);
	});

	useEffect(() => {
		const subscription = settingsEmitter.addListener(key, (nextValue: T) => {
			setValue(normalize(nextValue));
		});

		return () => subscription.remove();
	}, [key]);

	return value;
};
