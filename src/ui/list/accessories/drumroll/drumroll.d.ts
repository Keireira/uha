export type AccessoryDrumrollOnPressEvent = { nativeEvent: { index: number; label: string } };

export type AccessoryDrumrollT = {
	type: 'drumroll';
	trigger: string | number;
	selectedIndex: number;
	onPress: (event: AccessoryDrumrollOnPressEvent) => void;
	actions: {
		id: string;
		value: string | number;
		title: string;
	}[];
};
