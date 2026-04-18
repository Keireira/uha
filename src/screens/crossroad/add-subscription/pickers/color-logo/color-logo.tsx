import React, { useState, useRef, useEffect } from 'react';
import { Stack, useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

import { useAccent } from '@hooks';
import { useNewSubStore } from '../../hooks';
import { useShallow } from 'zustand/react/shallow';

import SymbolGrid from './symbols-grid';
import { ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import type { SearchBarCommands } from 'react-native-screens';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

type RouteParamsT = {
	logo_url: string;
	symbol: string;
};

const ColorLogo = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const [search, setSearch] = useState('');
	const searchRef = useRef<SearchBarCommands>(null);
	const navigation = useNavigation<NativeStackNavigationProp<Record<string, undefined>>>();

	const initialLogoParams = useLocalSearchParams<RouteParamsT>();
	const service = useNewSubStore(
		useShallow((state) => ({
			symbol: state.symbol,
			logo_url: state.logo_url,
			setBatch: state.actions.setBatch
		}))
	);

	useEffect(() => {
		const unsubscribe = navigation.addListener('transitionEnd', (e) => {
			if (e.data.closing) return;

			searchRef.current?.focus();
		});

		return unsubscribe;
	}, [navigation]);

	const openImagePickerHd = async () => {
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

		service.setBatch({
			logo_url: asset.uri,
			symbol: undefined
		});

		router.back();
	};

	const cancelSearchHd = () => {
		if (search) return;

		searchRef.current?.cancelSearch();
	};

	const openColorPickerHd = () => {
		router.push('/color-presets');
	};

	const changeSearchHd = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
		setSearch(e.nativeEvent.text);
	};

	const cancelEditsHd = () => {
		service.setBatch({
			logo_url: initialLogoParams.logo_url,
			symbol: initialLogoParams.symbol
		});

		router.back();
	};

	const finalizeEditsHd = () => {
		router.back();
	};

	const hasChanges = service.symbol !== initialLogoParams.symbol || service.logo_url !== initialLogoParams.logo_url;

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button icon="xmark" onPress={cancelEditsHd} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button
					variant="done"
					icon="checkmark"
					disabled={!hasChanges}
					onPress={finalizeEditsHd}
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>

			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				showsVerticalScrollIndicator={false}
				onScrollBeginDrag={cancelSearchHd}
			>
				<SymbolGrid search={search} />
			</ScrollView>

			<Stack.SearchBar
				ref={searchRef}
				inputType="text"
				autoCapitalize="none"
				placeholder="Search"
				hideNavigationBar={false}
				tintColor={settingAccent}
				onChangeText={changeSearchHd}
			/>

			<Stack.Toolbar placement="bottom">
				<Stack.Toolbar.Button icon="photo.stack" onPress={openImagePickerHd} />
				<Stack.Toolbar.Spacer />
				<Stack.Toolbar.SearchBarSlot />
				<Stack.Toolbar.Spacer />
				<Stack.Toolbar.Button icon="paintbrush.fill" onPress={openColorPickerHd} />
			</Stack.Toolbar>
		</>
	);
};

export default ColorLogo;
