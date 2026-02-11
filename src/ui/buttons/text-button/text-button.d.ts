import type { ButtonProps as ExpoButtonProps } from '@expo/ui/swift-ui';

export type Props = {
	size?: number;
	title: string;
	glassTint?: string;
} & ExpoButtonProps;
