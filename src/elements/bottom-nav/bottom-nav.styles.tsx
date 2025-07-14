import React from 'react';
import { BlurView } from 'expo-blur';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Pressable, useColorScheme } from 'react-native';
import { useAppModel } from '@models';

export const TabButton = styled.Pressable`
	flex: 1;
	width: 48px;
	height: 48px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Root = styled(Animated.View)`
	position: absolute;
	left: 12px;
	right: 12px;
	border-radius: 18px;
	bottom: 24px;
	border-top: 1px solid rgb(229, 231, 235);
	z-index: 999;
	overflow: hidden;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
`;

const BurpView = styled(BlurView)`
	padding: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

type Props = React.PropsWithChildren<React.ComponentProps<typeof Root>>;

const BottomNavRoot = ({ children, style = {}, ...props }: Props) => {
	const { scroll } = useAppModel();

	const colorScheme = useColorScheme();
	const tint = colorScheme === 'dark' ? 'dark' : 'light';

	const onPress = () => {
		scroll.setDirection('up');
	};

	return (
		<Root {...props} style={[style, { boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px' }]}>
			<Pressable onPress={onPress}>
				<BurpView intensity={25} tint={tint}>
					{children}
				</BurpView>
			</Pressable>
		</Root>
	);
};

export default BottomNavRoot;
