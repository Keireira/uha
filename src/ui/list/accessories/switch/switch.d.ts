export type AccessorySwitchT = {
	type: 'switch';
	value: boolean;
	disabled?: boolean;
	onPress: (value: boolean) => void;
};
