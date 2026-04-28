import React, { useState, useRef, useEffect } from 'react';
import { Stack, useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { useShallow } from 'zustand/react/shallow';

import SymbolGrid from './symbols-grid';
import { ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import type { TextInputChangeEvent } from 'react-native';
import type { SearchBarCommands } from 'react-native-screens';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LogoDraftT } from '@screens/crossroad/add-subscription/events';

type RouteParamsT = {
	logo_url?: LogoDraftT['image_uri'];
	symbol?: LogoDraftT['symbol'];
};

const ColorLogo = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const navigation = useNavigation<NativeStackNavigationProp<Record<string, undefined>>>();

	const searchRef = useRef<SearchBarCommands>(null);
	const [search, setSearch] = useState('');

	/* Snapshot the initial params once — useLocalSearchParams may re-emit on focus */
	const params = useLocalSearchParams<RouteParamsT>();
	const [initialParams] = useState(params);

		const draft = useDraftStore(
			useShallow((state) => ({
				logo: state.logo,
				patch: state.actions.patch,
				setLogoImage: state.actions.setLogoImage
			}))
		);

	useEffect(() => {
		const unsubscribe = navigation.addListener('transitionEnd', (e) => {
			if (e.data.closing) {
				return;
			}

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

		if (result.canceled || !result.assets.length) return;

		const [asset] = result.assets;
		draft.setLogoImage(asset.uri);
		router.back();
	};

	const dismissSearchIfEmptyHd = () => {
		if (search) return;
		searchRef.current?.cancelSearch();
	};

	const openColorPickerHd = () => {
		router.push('/color-presets');
	};

	const changeSearchHd = (e: TextInputChangeEvent) => {
		setSearch(e.nativeEvent.text);
	};

		const cancelEditsHd = () => {
			draft.patch({
				logo: {
					...draft.logo,
					image_uri: initialParams.logo_url,
					symbol: initialParams.symbol
				}
			});
			router.back();
		};

	const finalizeEditsHd = () => {
		router.back();
	};

		const hasChanges = draft.logo.symbol !== initialParams.symbol || draft.logo.image_uri !== initialParams.logo_url;

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
				onScrollBeginDrag={dismissSearchIfEmptyHd}
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
