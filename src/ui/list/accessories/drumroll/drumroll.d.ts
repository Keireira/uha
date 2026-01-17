export type PickerOptionSelectedEvent = {
	nativeEvent: {
		index: number;
		label: string;
	};
};

export type AccessoryDrumrollT = {
	type: 'drumroll';
	trigger: string | number;
	selectedIndex: number;
	onPress: (event: PickerOptionSelectedEvent) => void;
	actions: {
		id: string;
		value: string | number;
		title: string;
	}[];
};
