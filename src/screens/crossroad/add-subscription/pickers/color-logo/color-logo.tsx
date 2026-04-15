import React, { useState } from 'react';
import { equals } from 'ramda';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { useAccent } from '@hooks';
import { useNewSubStore } from '../../hooks';
import { useHeaderHeight } from '@react-navigation/elements';

import { View } from 'react-native';
import SymbolGrid from './symbol-grid';
import ColorSwatches from './color-swatches';
import * as ImagePicker from 'expo-image-picker';
import Root from './color-logo.styles';

import type { NativeSyntheticEvent, TextInputFocusEventData, NativeScrollEvent } from 'react-native';

type RouteParamsT = {
	color: string;
	logo_url: string;
	symbol: string;
};

const useOnViewScroll = () => {
	const headerHeight = useHeaderHeight();
	const [stickyPad, setStickyPad] = useState(0);

	const onViewScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offset = e.nativeEvent.contentOffset.y;

		if (offset + headerHeight > 0) {
			setStickyPad(headerHeight);
		} else {
			setStickyPad(0);
		}
	};

	return {
		stickyPad,
		onViewScroll
	};
};

const ColorLogo = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const [search, setSearch] = useState('');
	const { stickyPad, onViewScroll } = useOnViewScroll();
	const initialLogoParams = useLocalSearchParams<RouteParamsT>();
	const { actions, ...service } = useNewSubStore((state) => state);

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
				<Stack.Toolbar.Button
					variant="done"
					icon="checkmark"
					onPress={finalizeEdits}
					tintColor={settingAccent}
					disabled={equals(initialLogoParams, currentParams)}
				/>
			</Stack.Toolbar>

			<Root stickyHeaderIndices={[0]} onScroll={onViewScroll}>
				<View style={{ paddingTop: stickyPad }}>
					<ColorSwatches />
				</View>

				<SymbolGrid search={search} />
			</Root>

			{/*<ColorPresets color={color} presets={presets} onSelectColor={setColor} onPresetsChange={handlePresetsChange} />*/}

			<Stack.SearchBar
				autoFocus
				inputType="text"
				autoCapitalize="none"
				placeholder="Search"
				hideNavigationBar={false}
				tintColor={settingAccent}
				onChangeText={searchBySymbols}
			/>

			<Stack.Toolbar placement="bottom">
				<Stack.Toolbar.Button icon="photo.stack" onPress={openImagePicker} />
				<Stack.Toolbar.Spacer />
				<Stack.Toolbar.SearchBarSlot />
				<Stack.Toolbar.Spacer />
				<Stack.Toolbar.Button icon="paintbrush.fill" onPress={openColorPicker} />
			</Stack.Toolbar>
		</>
	);
};

export default ColorLogo;
