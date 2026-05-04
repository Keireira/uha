import React, { useRef, useState } from 'react';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { useAccent } from '@hooks';
import { useParams } from './hooks';
import SymbolGrid from './symbols-grid';
import { ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import type { TextInputChangeEvent } from 'react-native';
import type { SearchBarCommands } from 'react-native-screens';
import type { LogoSnapshotT, SearchParamsT } from './select-symbol-logo.d';

const SelectSymbolLogoScreen = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const { target } = useLocalSearchParams<SearchParamsT>();

	const [search, setSearch] = useState('');
	const searchRef = useRef<SearchBarCommands>(null);

	const paramsBinding = useParams();

	/* Snapshot logo state as picker opens. Cancel restores it. */
	const [snapshot] = useState<LogoSnapshotT>({
		image_uri: paramsBinding.image_uri,
		symbol: paramsBinding.symbol
	});

	/* Open image picker and set the selected image URI */
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
		paramsBinding.setImageUri(asset.uri);
		router.back();
	};

	/* Cancel search if empty on scroll */
	const dismissSearchIfEmptyHd = () => {
		if (search) return;

		searchRef.current?.cancelSearch();
	};

	const changeSearchHd = (e: TextInputChangeEvent) => {
		setSearch(e.nativeEvent.text);
	};

	/* Cancel edits and restore logo's snapshot */
	const cancelEditsHd = () => {
		if (snapshot.image_uri) {
			paramsBinding.setImageUri(snapshot.image_uri);
		} else if (snapshot.symbol) {
			paramsBinding.setSymbol(snapshot.symbol);
		}

		router.back();
	};

	const finalizeEditsHd = () => {
		router.back();
	};

	const showImagePicker = !['library_category_logo', 'library_tender_logo'].includes(target);
	const woChanges = paramsBinding.symbol === snapshot.symbol && paramsBinding.image_uri === snapshot.image_uri;

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button icon="xmark" onPress={cancelEditsHd} />

				{showImagePicker && (
					<Stack.Toolbar.Button separateBackground variant="plain" icon="photo.stack" onPress={openImagePickerHd} />
				)}
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button
					variant="done"
					icon="checkmark"
					disabled={woChanges}
					onPress={finalizeEditsHd}
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentInsetAdjustmentBehavior="automatic"
				onScrollBeginDrag={dismissSearchIfEmptyHd}
			>
				<SymbolGrid search={search} />
			</ScrollView>

			<Stack.Toolbar placement="bottom">
				<Stack.SearchBar
					ref={searchRef}
					inputType="text"
					autoCapitalize="none"
					placeholder="Search"
					hideNavigationBar={false}
					tintColor={settingAccent}
					onChangeText={changeSearchHd}
				/>
			</Stack.Toolbar>
		</>
	);
};

export default SelectSymbolLogoScreen;
