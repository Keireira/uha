import React, { useState, useEffect } from 'react';
import { splitEvery } from 'ramda';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { useNewSubStore } from '../../../hooks';

import db from '@db';
import { eq } from 'drizzle-orm';
import { userTable } from '@db/schema';

import { View, ScrollView } from 'react-native';
import ColorPicker, { HueSlider, SaturationSlider } from 'reanimated-color-picker';

import { Host, VStack, HStack, ZStack, Spacer, Text, Image, Grid, ColorPicker as SystemColorPicker } from '@expo/ui/swift-ui';
import type { SFSymbol } from 'sf-symbols-typescript';
import {
	font,
	frame,
	padding,
	clipShape,
	border,
	background,
	foregroundStyle,
	onTapGesture
} from '@expo/ui/swift-ui/modifiers';

const USER_ID = '00000000-0000-0000-0000-000000000000';
const COLUMNS = 4;
const CIRCLE_SIZE = 44;

const ColorPresets = () => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useAccent();
	const { actions, ...service } = useNewSubStore((state) => state);

	const [editing, setEditing] = useState(false);
	const [presets, setPresets] = useState<string[]>([]);
	const [pickerHex, setPickerHex] = useState(service.color || '#778beb');
	const [pickerKey, setPickerKey] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	useEffect(() => {
		const execute = async () => {
			const [user] = await db.select().from(userTable).where(eq(userTable.id, USER_ID)).execute();

			if (user) {
				setPresets(user.color_presets);
			}
		};

		execute();
	}, []);

	const onPresetsChange = async (next: string[]) => {
		setPresets(next);

		await db.update(userTable).set({ color_presets: next }).where(eq(userTable.id, USER_ID));
	};

	const handleDeleteColor = (hex: string) => {
		onPresetsChange(presets.filter((c) => c !== hex));
		setSelectedIndex(null);
	};

	const handleSelectColor = (hex: string) => {
		if (editing) {
			handleDeleteColor(hex);
		} else {
			const idx = presets.indexOf(hex);
			setSelectedIndex(idx);
			setPickerHex(hex);
			setPickerKey((k) => k + 1);
		}
	};

	const handleSliderComplete = ({ hex }: { hex: string }) => {
		setPickerHex(hex);

		if (selectedIndex !== null && selectedIndex < presets.length) {
			const next = [...presets];
			next[selectedIndex] = hex;
			onPresetsChange(next);
		}
	};

	const handleNativePickerChange = (hex: string) => {
		setPickerHex(hex);
		setPickerKey((k) => k + 1);

		if (selectedIndex !== null && selectedIndex < presets.length) {
			const next = [...presets];
			next[selectedIndex] = hex;
			onPresetsChange(next);
		}
	};

	const confirm = () => {
		actions.setColor(pickerHex);
		router.back();
	};

	const back = () => router.back();

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button icon="xmark" onPress={back} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={confirm} tintColor={settingAccent} />
			</Stack.Toolbar>

			<ScrollView
				contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 16 }}
				contentInsetAdjustmentBehavior="automatic"
				showsVerticalScrollIndicator={false}
			>
				{/* Color picker sliders */}
				<ColorPicker
					key={pickerKey}
					value={pickerHex}
					onCompleteJS={handleSliderComplete}
					style={{ width: '100%', gap: 14 }}
				>
					<HueSlider style={{ height: 32, borderRadius: 16 }} />
					<SaturationSlider style={{ height: 32, borderRadius: 16 }} />
				</ColorPicker>

				{/* Hex display + native color picker */}
				<Host matchContents style={{ width: '100%' }}>
					<SystemColorPicker
						selection={pickerHex}
						onSelectionChange={handleNativePickerChange}
						label={`#${pickerHex.replace('#', '').toUpperCase()}`}
					/>
				</Host>

				{/* Presets header */}
				<Host matchContents style={{ width: '100%' }}>
					<HStack>
						<Text modifiers={[font({ size: 16, weight: 'bold' }), foregroundStyle(theme.text.primary)]}>
							Presets
						</Text>
						<Spacer />
						<Text
							modifiers={[
								font({ size: 16, weight: 'semibold' }),
								foregroundStyle(settingAccent),
								onTapGesture(() => setEditing(!editing))
							]}
						>
							{editing ? 'Done' : 'Edit'}
						</Text>
					</HStack>
				</Host>

				{/* Preview + Presets grid */}
				<View style={{ flexDirection: 'row', gap: 12 }}>
					{/* Color preview */}
					<Host matchContents>
						<ZStack alignment="center" modifiers={[frame({ width: 64, height: 64 })]}>
							<Text
								modifiers={[
									frame({ width: 64, height: 64 }),
									background(pickerHex, { shape: 'circle' }),
									clipShape('circle')
								]}
							>
								{' '}
							</Text>
							{service.symbol && (
								<Image
									systemName={service.symbol as SFSymbol}
									size={28}
									color="#fff"
								/>
							)}
						</ZStack>
					</Host>

					{/* Grid */}
					<Host matchContents style={{ flex: 1 }}>
						<VStack>
							<Grid horizontalSpacing={12} verticalSpacing={12}>
							{splitEvery(COLUMNS, presets).map((row) => (
								<Grid.Row key={row[0]}>
									{row.map((hex) => {
										const idx = presets.indexOf(hex);
										const isSelected = selectedIndex === idx;

										return (
											<ZStack
												key={hex}
												alignment="topTrailing"
												modifiers={[
													frame({ width: CIRCLE_SIZE, height: CIRCLE_SIZE }),
													onTapGesture(() => handleSelectColor(hex))
												]}
											>
												<Text
													modifiers={[
														frame({ width: CIRCLE_SIZE, height: CIRCLE_SIZE }),
														background(hex, { shape: 'circle' }),
														clipShape('circle'),
														...(isSelected
															? [border({ color: 'rgba(255,255,255,0.6)', width: 2.5 })]
															: [])
													]}
												>
													{' '}
												</Text>
												{editing && (
													<Image
														systemName="minus.circle.fill"
														size={16}
														color={theme.accents.red}
													/>
												)}
											</ZStack>
										);
									})}
								</Grid.Row>
							))}
						</Grid>

						{editing && (
							<HStack spacing={6}>
								<Image systemName="hand.tap" size={14} color={theme.text.tertiary} />
								<Text modifiers={[font({ size: 13 }), foregroundStyle(theme.text.tertiary)]}>
									Tap and hold to reorder
								</Text>
							</HStack>
						)}
						</VStack>
					</Host>
				</View>

				{/* Add color via native picker */}
				<Host matchContents style={{ width: '100%' }}>
					<SystemColorPicker
						selection={pickerHex}
						onSelectionChange={(hex) => {
							setPickerHex(hex);
							setPickerKey((k) => k + 1);
							if (!presets.includes(hex)) {
								onPresetsChange([...presets, hex]);
							}
						}}
						label="Add color"
					/>
				</Host>
			</ScrollView>
		</>
	);
};

export default ColorPresets;
