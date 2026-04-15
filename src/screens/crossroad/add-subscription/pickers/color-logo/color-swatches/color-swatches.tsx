import React, { useEffect, useState } from 'react';

import db from '@db';
import { eq } from 'drizzle-orm';
import { userTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useNewSubStore } from '../../../hooks';

import { Host, HStack, Text, ScrollView } from '@expo/ui/swift-ui';
import {
	font,
	bold,
	frame,
	shadow,
	padding,
	opacity,
	clipShape,
	background,
	glassEffect,
	foregroundStyle,
	onTapGesture
} from '@expo/ui/swift-ui/modifiers';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const CIRCLE_SIZE = 44;
const USER_ID = '00000000-0000-0000-0000-000000000000';

const SELECTED = [
	bold(),
	opacity(1),
	foregroundStyle('#fafafa'),
	font({ size: 24, weight: 'bold' }),
	shadow({ radius: 4, x: 0, y: 2, color: '#00000025' })
];
const NOT_SELECTED = [opacity(0.8)];

const ColorSwatches = () => {
	const [presets, setPresets] = useState<string[]>([]);
	const selectedColor = useNewSubStore((state) => state.color);
	const setColor = useNewSubStore((state) => state.actions.setColor);

	const {
		data: [user]
	} = useLiveQuery(db.select().from(userTable).where(eq(userTable.id, USER_ID)), []);

	useEffect(() => {
		if (!user?.color_presets) return;

		setPresets(user.color_presets);
	}, [user]);

	return (
		<MaskedView
			maskElement={
				<LinearGradient
					colors={['transparent', 'black', 'black', 'transparent']}
					locations={[0, 0.03, 0.97, 1]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={{ flex: 1 }}
				/>
			}
		>
			<Host matchContents style={{ flex: 1 }}>
				<ScrollView axes="horizontal" showsIndicators={false}>
					<HStack spacing={12} modifiers={[padding({ horizontal: 16, vertical: 16 })]}>
						{presets.map((color) => {
							const isSelected = selectedColor === color;
							const modifiers = isSelected ? SELECTED : NOT_SELECTED;

							return (
								<Text
									key={color}
									modifiers={[
										frame({ width: CIRCLE_SIZE, height: CIRCLE_SIZE }),
										background(color),
										...modifiers,
										clipShape('circle'),
										glassEffect({
											glass: {
												variant: 'clear',
												interactive: true,
												tint: color
											},
											shape: 'circle'
										}),
										onTapGesture(() => {
											if (isSelected) return;

											setColor(color);
										})
									]}
								>
									{isSelected ? '✓' : ' '}
								</Text>
							);
						})}
					</HStack>
				</ScrollView>
			</Host>
		</MaskedView>
	);
};

export default ColorSwatches;
