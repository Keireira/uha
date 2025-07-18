import React, { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';

import { AddIcon } from '@ui/icons';
import { BottomSheet } from '@expo/ui/swift-ui';
import { Grid, Icon, TileButton, TilePress, TileText } from './crossroad.styles';

import type { Props } from './crossroad.d';

const useCrossroadRoutes = () => {
	const { t } = useTranslation();

	const routes = useMemo(() => {
		return [
			{ title: t('crossroad.category'), route: '/(crossroad)/add-category' },
			{ title: t('crossroad.service'), route: '/(crossroad)/add-service' },
			{ title: t('crossroad.subscription'), route: '/(crossroad)/add-subscription' },
			{ title: t('crossroad.payment'), route: '/(crossroad)/add-payment' }
		];
	}, [t]);

	return routes;
};

const useTileSizes = () => {
	const { width } = useWindowDimensions();

	const tile = useMemo(() => {
		const tileWidth = width / 2 - 32;
		const tileHeight = (tileWidth / 4) * 3;

		return { width: tileWidth, height: tileHeight };
	}, [width]);

	return tile;
};

const Crossroad = ({ isOpened, onIsOpenedChange }: Props) => {
	const router = useRouter();
	const tile = useTileSizes();
	const crossroadRoutes = useCrossroadRoutes();

	const handleOptionPress = (route: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onIsOpenedChange(false);
		router.push(route as any);
	};

	if (!isOpened) {
		return null;
	}

	return (
		<BottomSheet isOpened={isOpened} onIsOpenedChange={onIsOpenedChange}>
			<Grid style={{ height: tile.height * 2 + 92 }}>
				{crossroadRoutes.map((route) => (
					<TileButton key={route.route} $width={tile.width} onPress={() => handleOptionPress(route.route)}>
						<TilePress>
							<Icon>
								<AddIcon />
							</Icon>

							<TileText>{route.title}</TileText>
						</TilePress>
					</TileButton>
				))}
			</Grid>
		</BottomSheet>
	);
};

export default Crossroad;
