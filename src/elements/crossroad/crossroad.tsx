import React from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import { Text } from '@ui';
import { AddIcon } from '@ui/icons';
import { Pressable, useWindowDimensions } from 'react-native';
import { BottomSheet } from '@expo/ui/swift-ui';
import styled from 'styled-components/native';

import { Grid, Square } from './crossroad.styles';

import type { Props } from './crossroad.d';

const CROSSROAD_ROUTES = [
	{ title: 'Subscription', route: '/(crossroad)/add-subscription' },
	{ title: 'Category', route: '/(crossroad)/add-category' },
	{ title: 'Application', route: '/(crossroad)/add-service' },
	{ title: 'Payment', route: '/(crossroad)/add-payment' }
];

const Icon = styled.View`
	background-color: #dfdfdf;
	padding: 16px;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 32px;
`;

const Crossroad = ({ isOpened, onIsOpenedChange }: Props) => {
	const router = useRouter();
	const { width } = useWindowDimensions();

	const handleOptionPress = (route: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onIsOpenedChange(false);
		router.push(route as any);
	};

	const tileWidth = width / 2 - 32;
	const tileHeight = (tileWidth / 4) * 3;

	return (
		<BottomSheet isOpened={isOpened} onIsOpenedChange={onIsOpenedChange}>
			<Grid style={{ height: tileHeight * 2 + 92 }}>
				{CROSSROAD_ROUTES.map((route) => (
					<Square key={route.route} $width={tileWidth} onPress={() => handleOptionPress(route.route)}>
						<Pressable
							style={{
								height: '100%',
								padding: 16,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between'
							}}
						>
							<Icon>
								<AddIcon />
							</Icon>

							<Text
								style={{
									fontSize: 22,
									fontWeight: 'bold'
								}}
							>
								{route.title}
							</Text>
						</Pressable>
					</Square>
				))}
			</Grid>
		</BottomSheet>
	);
};

export default Crossroad;
