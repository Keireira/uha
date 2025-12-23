import React, { useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';

import { BottomSheet } from '@expo/ui/swift-ui';
import { AddIcon } from '@ui/icons';
import {
	Grid,
	Icon,
	TileButton,
	TilePress,
	TileText,
	Entities,
	FullButton,
	SheetHost,
	TileButtonHost,
	FullButtonHost
} from './crossroad.styles';

import type { Href } from 'expo-router';
import type { Props, RouteT } from './crossroad.d';

const useCrossroadRoutes = () => {
	const { t } = useTranslation();

	const routes: RouteT[] = useMemo(() => {
		return [
			{ id: 1, title: t('crossroad.category'), route: '/add-category' },
			{ id: 2, title: t('crossroad.service'), route: '/add-service' },
			{ id: 4, title: t('crossroad.payment'), route: '/add-payment' }
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
	const { t } = useTranslation();

	const tile = useTileSizes();
	const crossroadRoutes = useCrossroadRoutes();

	const handleOptionPress = (route: Href) => {
		router.push(route);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onIsOpenedChange(false);
	};

	if (!isOpened) {
		return null;
	}

	return (
		<SheetHost $height={tile.height * 2 + 92}>
			<BottomSheet isOpened={isOpened} onIsOpenedChange={onIsOpenedChange}>
				<Grid>
					<Entities>
						{crossroadRoutes.map((route) => (
							<TileButtonHost key={route.id} $height={tile.height}>
								<TileButton onPress={() => handleOptionPress(route.route)}>
									<TilePress>
										<Icon>
											<AddIcon />
										</Icon>

										<TileText>{route.title}</TileText>
									</TilePress>
								</TileButton>
							</TileButtonHost>
						))}
					</Entities>

					<FullButtonHost $height={tile.height}>
						<FullButton onPress={() => handleOptionPress('/add-subscription')}>
							<TilePress>
								<Icon>
									<AddIcon />
								</Icon>

								<TileText>{t('crossroad.subscription')}</TileText>
							</TilePress>
						</FullButton>
					</FullButtonHost>
				</Grid>
			</BottomSheet>
		</SheetHost>
	);
};

export default Crossroad;
