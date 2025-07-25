import React, { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';

import { AddIcon } from '@ui/icons';
import { BottomSheet } from '@expo/ui/swift-ui';
import { Grid, Icon, TileButton, TilePress, TileText, Entities, FullButton } from './crossroad.styles';

import type { Href } from 'expo-router';
import type { Props, RouteT } from './crossroad.d';

const useCrossroadRoutes = () => {
	const { t } = useTranslation();

	const routes: RouteT[] = useMemo(() => {
		return [
			{ id: 1, title: t('crossroad.category'), route: '/(crossroad)/add-category' },
			{ id: 2, title: t('crossroad.service'), route: '/(crossroad)/add-service' },
			{ id: 4, title: t('crossroad.payment'), route: '/(crossroad)/add-payment' }
		];
	}, [t]);

	return routes;
};

const useTileSizes = () => {
	const { width } = useWindowDimensions();

	const tile = useMemo(() => {
		const tileWidth = width / 3 - 24;
		const tileHeight = tileWidth;

		return { width: tileWidth, height: tileHeight, fullWidth: width - 36 };
	}, [width]);

	return tile;
};

const Crossroad = ({ isOpened, onIsOpenedChange }: Props) => {
	const router = useRouter();
	const tile = useTileSizes();
	const { t } = useTranslation();
	const crossroadRoutes = useCrossroadRoutes();

	const handleOptionPress = (route: Href) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onIsOpenedChange(false);
		router.push(route);
	};

	if (!isOpened) {
		return null;
	}

	return (
		<BottomSheet isOpened={isOpened} onIsOpenedChange={onIsOpenedChange}>
			<Grid style={{ height: tile.height * 2 + 92 }}>
				<Entities>
					{crossroadRoutes.map((route) => (
						<TileButton key={route.id} $height={tile.height} onPress={() => handleOptionPress(route.route)}>
							<TilePress>
								<Icon>
									<AddIcon />
								</Icon>

								<TileText>{route.title}</TileText>
							</TilePress>
						</TileButton>
					))}
				</Entities>

				<FullButton onPress={() => handleOptionPress('/(crossroad)/add-subscription')}>
					<TilePress>
						<Icon>
							<AddIcon />
						</Icon>

						<TileText>{t('crossroad.subscription')}</TileText>
					</TilePress>
				</FullButton>
			</Grid>
		</BottomSheet>
	);
};

export default Crossroad;
