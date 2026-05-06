import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import * as ImagePicker from 'expo-image-picker';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import {
	font,
	frame,
	shapes,
	resizable,
	clipShape,
	contentShape,
	onTapGesture,
	foregroundStyle,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import { swipeActions } from '@modules/expo-ui-modifiers';
import { Text, Image, LabeledContent } from '@expo/ui/swift-ui';

type Props = {
	imageUri: string | undefined;
};

const LogoUrl = ({ imageUri }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const setLogoImage = useDraftStore((state) => state.actions.setLogoImage);

	const openImagePicker = async () => {
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
		setLogoImage(asset.uri);
	};

	const clearImage = () => {
		setLogoImage(undefined);
	};

	return (
		<LabeledContent
			label={t('library.details.fields.logo_url')}
			modifiers={[
				contentShape(shapes.rectangle()),
				onTapGesture(openImagePicker),
				...swipeActions({
					actions: [
						{
							id: 'clear',
							enabled: Boolean(imageUri),
							systemImage: 'pencil.and.outline',
							tint: theme.semantic.error,
							onPress: clearImage,
							label: t('library.details.actions.clear')
						}
					]
				})
			]}
		>
			{imageUri ? (
				<Image
					uiImage={imageUri}
					modifiers={[resizable(), frame({ width: 28, height: 28 }), clipShape('roundedRectangle')]}
				/>
			) : (
				<Text
					modifiers={[
						multilineTextAlignment('trailing'),
						foregroundStyle(theme.text.secondary),
						font({ size: 16, weight: 'regular', design: 'rounded' })
					]}
				>
					—
				</Text>
			)}
		</LabeledContent>
	);
};

export default LogoUrl;
