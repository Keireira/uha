import type { ButtonProps as ExpoButtonProps } from '@expo/ui/swift-ui';

export type Props = {
	size?: number;
	glassTint?: string;
	symbolColor?: string;
} & ExpoButtonProps;
