import React, { useState } from 'react';
import { equals } from 'ramda';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { useAccent } from '@hooks';
import useAddSubcriptionStore from '../../store';
import SymbolGrid from './symbol-grid';
import ColorSwatches from './color-swatches';
import * as ImagePicker from 'expo-image-picker';
import Root from './color-logo.styles';
import { Host, VStack, HStack, Text, ScrollView } from '@expo/ui/swift-ui';
import {
	frame,
	padding,
	clipShape,
	background,
	opacity,
	shadow,
	font,
	foregroundStyle,
	bold,
	onTapGesture
} from '@expo/ui/swift-ui/modifiers';

import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

type RouteParamsT = {
	color: string;
	logo_url: string;
	symbol: string;
};

const ColorLogo = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const initialLogoParams = useLocalSearchParams<RouteParamsT>();

	const [search, setSearch] = useState('');
	const { actions, ...service } = useAddSubcriptionStore((state) => state);

	const openImagePicker = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
			exif: false,
			shouldDownloadFromNetwork: true
		});

		if (result.canceled || !result.assets.length) {
			return;
		}

		const [asset] = result.assets;

		actions.setBatch({
			logo_url: asset.uri,
			symbol: undefined
		});

		router.back();
	};

	const handleSelectSymbol = (symbol: string) => {
		actions.setBatch({
			logo_url: undefined,
			symbol: service.symbol === symbol ? undefined : symbol
		});
	};

	const openColorPicker = () => {
		console.log('+++');
	};

	const searchBySymbols = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		setSearch(e.nativeEvent.text);
	};

	const handleCancelEdits = () => {
		actions.setBatch({
			color: initialLogoParams.color,
			logo_url: initialLogoParams.logo_url,
			symbol: initialLogoParams.symbol
		});

		router.back();
	};

	const finalizeEdits = () => {
		router.back();
	};

	const currentParams = {
		color: service.color,
		symbol: service.symbol,
		logo_url: service.logo_url
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button icon="xmark" onPress={handleCancelEdits} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Menu icon="ellipsis">
					<Stack.Toolbar.MenuAction icon="paintbrush.pointed" onPress={openColorPicker}>
						<Stack.Toolbar.Label>Color Palette</Stack.Toolbar.Label>
					</Stack.Toolbar.MenuAction>

					<Stack.Toolbar.MenuAction icon="photo.stack" onPress={openImagePicker}>
						<Stack.Toolbar.Label>Custom Logo</Stack.Toolbar.Label>
					</Stack.Toolbar.MenuAction>
				</Stack.Toolbar.Menu>

				<Stack.Toolbar.Button
					variant="done"
					icon="checkmark"
					onPress={finalizeEdits}
					tintColor={settingAccent}
					disabled={equals(initialLogoParams, currentParams)}
				/>
			</Stack.Toolbar>

			<Root>
				<ColorSwatches />
			</Root>

			{/* SymbolGrid тоже можно сюда как SwiftUI компонент */}

			{/*<Root>
				<ColorSwatches />

				{/*<ColorPresets color={color} presets={presets} onSelectColor={setColor} onPresetsChange={handlePresetsChange} />*/}

			{/*<SymbolGrid selected={service.symbol} color={service.color} search={search} onSelect={handleSelectSymbol} />*/}
			{/*</Root>*/}

			<Stack.Toolbar placement="bottom">
				<Stack.SearchBar
					autoFocus
					inputType="text"
					autoCapitalize="none"
					placeholder="Search"
					hideNavigationBar={false}
					tintColor={settingAccent}
					onChangeText={searchBySymbols}
				/>
			</Stack.Toolbar>
		</>
	);
};

export default ColorLogo;
