import React, { useEffect, useState, useMemo } from 'react';

import { setAppIcon, getAppIcon } from '@howincodes/expo-dynamic-app-icon';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { SymbolView } from 'expo-symbols';
import SquircleMask from '@assets/masks/squircle.svg.tsx';
import Root, { PressMe, AnimateMe, CheckSF } from './app-logo-picker.styles';

import type { LogoPageT } from './app-logo-picker.d';

const LOGO_PAGES: LogoPageT[] = [
	{
		key: 'DEFAULT',
		source: require('@assets/images/ios-light.png')
	},
	{
		key: 'enby',
		source: require('@assets/images/enby-icon.png')
	},
	{
		key: 'trans',
		source: require('@assets/images/trans-icon.png')
	},
	{
		key: 'lesbi',
		source: require('@assets/images/lesbi-icon.png')
	},
	{
		key: 'pan',
		source: require('@assets/images/pan-icon.png')
	}
];

const ANIM_CONFIG = {
	mass: 0.35,
	damping: 30,
	stiffness: 210
};

const AppLogoPicker = () => {
	const iconScale = useSharedValue(1);
	const iconScaledStyle = useAnimatedStyle(() => ({
		transform: [{ scale: iconScale.value }]
	}));

	const [appIcon, setAppIconLocal] = useState(() => getAppIcon());

	useEffect(() => {
		const activeIcon = getAppIcon();

		if (activeIcon !== appIcon) {
			setAppIcon(appIcon === 'DEFAULT' ? null : appIcon);

			iconScale.value = withSpring(0.9, ANIM_CONFIG, () => {
				iconScale.value = withSpring(1.2, ANIM_CONFIG, () => {
					iconScale.value = withSpring(1, ANIM_CONFIG);
				});
			});
		}
	}, [appIcon]);

	const defaultPage = useMemo(() => {
		return LOGO_PAGES.findIndex((page) => page.key === appIcon) || 0;
	}, []);

	return (
		<Root initialPage={defaultPage} overdrag>
			{LOGO_PAGES.map((page) => {
				const isActive = page.key === appIcon;

				return (
					<PressMe key={page.key} onPress={() => setAppIconLocal(page.key)}>
						<AnimateMe style={iconScaledStyle}>
							{isActive && (
								<CheckSF>
									<SymbolView
										name="checkmark.seal.fill"
										size={28}
										tintColor="green"
										animationSpec={{ effect: { type: 'scale', wholeSymbol: true } }}
									/>
								</CheckSF>
							)}

							<SquircleMask link={page.source} size={128} />
						</AnimateMe>
					</PressMe>
				);
			})}
		</Root>
	);
};

export default AppLogoPicker;
