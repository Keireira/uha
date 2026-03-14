import React, { useState } from 'react';

import * as Haptics from 'expo-haptics';
import { useWindowDimensions } from 'react-native';
import { setAppIcon, getAppIcon } from '@howincodes/expo-dynamic-app-icon';

import AnimatedStar from './animated-star';
import Root, { Line } from './app-logo-picker.styles';

import APP_LOGOS from './logos';
import type { AppLogoT, PositionT } from './app-logo-picker.d';

const STAR_DOT_SIZES = [14, 11, 10, 8, 7];
const STAR_EDGES = [
	[0, 1],
	[0, 2],
	[1, 2],
	[0, 3],
	[0, 4]
];

const getStarPositions = (screenWidth: number) => {
	const cx = screenWidth / 2;

	return [
		{ x: cx, y: 160 }, // α Lup (2.3) — center
		{ x: cx - 60, y: 80 }, // β Lup (2.7) — upper left
		{ x: cx + 70, y: 75 }, // γ Lup (2.8) — upper right
		{ x: cx - 110, y: 235 }, // δ Lup (3.2) — lower left
		{ x: cx + 65, y: 245 } // ε Lup (3.4) — lower right
	];
};

const getLineStyle = (from: PositionT, to: PositionT) => {
	const dx = to.x - from.x;
	const dy = to.y - from.y;

	return {
		left: from.x,
		top: from.y,
		width: Math.sqrt(dx * dx + dy * dy),
		transformOrigin: '0 0' as const,
		transform: [{ rotate: `${Math.atan2(dy, dx) * (180 / Math.PI)}deg` }]
	};
};

const AppLogoPicker = () => {
	const { width } = useWindowDimensions();
	const [activeIcon, setActiveIcon] = useState(getAppIcon);

	const starPositions = getStarPositions(width);

	const handleIconSelect = (key: AppLogoT['key']) => {
		setActiveIcon(key);
		setAppIcon(key === 'DEFAULT' ? null : key);

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	return (
		<Root>
			{STAR_EDGES.map(([a, b]) => (
				<Line key={`${a}-${b}`} style={getLineStyle(starPositions[a], starPositions[b])} />
			))}

			{APP_LOGOS.map((logo, i) => (
				<AnimatedStar
					key={logo.key}
					logo={logo}
					dotSize={STAR_DOT_SIZES[i]}
					position={starPositions[i]}
					isActive={logo.key === activeIcon}
					onPress={() => handleIconSelect(logo.key)}
				/>
			))}
		</Root>
	);
};

export default AppLogoPicker;
