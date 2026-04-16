import React, { useState, useRef, useEffect } from 'react';
import { equals } from 'ramda';
import { Stack, useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

import { useAccent } from '@hooks';
import { useNewSubStore } from '../../hooks';
import { useHeaderHeight } from '@react-navigation/elements';

import SymbolGrid from './symbol-grid';
import ColorSwatches from './color-swatches';
import { View, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import type { SearchBarCommands } from 'react-native-screens';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeSyntheticEvent, TextInputFocusEventData, NativeScrollEvent } from 'react-native';

type RouteParamsT = {
	color: string;
	logo_url: string;
	symbol: string;
};

const ColorLogo = () => {
	const router = useRouter();
	const navigation = useNavigation<NativeStackNavigationProp<Record<string, undefined>>>();
	const settingAccent = useAccent();
	const searchRef = useRef<SearchBarCommands>(null);
	const [search, setSearch] = useState('');
	const headerHeight = useHeaderHeight();
	const [stickyPad, setStickyPad] = useState(0);

	const initialLogoParams = useLocalSearchParams<RouteParamsT>();
	const { actions, ...service } = useNewSubStore((state) => state);

	useEffect(() => {
		const unsubscribe = navigation.addListener('transitionEnd', (e) => {
			if (e.data.closing) return;

			searchRef.current?.focus();
		});

		return () => unsubscribe();
	}, [navigation]);

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

	const onViewScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (searchRef.current && !search) {
			searchRef.current?.cancelSearch();
		}

		const offset = e.nativeEvent.contentOffset.y;

		if (offset + headerHeight > 0) {
			setStickyPad(headerHeight);
		} else {
			setStickyPad(0);
		}
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

			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[0]}
				onScroll={onViewScroll}
			>
				<View style={{ paddingTop: stickyPad }}>
					<ColorSwatches />
				</View>

				<SymbolGrid search={search} />
			</ScrollView>

			<Stack.SearchBar
				ref={searchRef}
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
