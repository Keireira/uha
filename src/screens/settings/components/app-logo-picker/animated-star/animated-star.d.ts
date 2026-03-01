import type { AppLogoT, PositionT } from '../app-logo-picker.d';

export type Props = {
	logo: AppLogoT;
	dotSize: number;
	position: PositionT;
	isActive: boolean;
	onPress: () => void;
};
