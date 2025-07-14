import type { PropsWithChildren, ComponentProps } from 'react';
import Animated from 'react-native-reanimated';

export type Props = PropsWithChildren<ComponentProps<typeof Animated.View>>;
