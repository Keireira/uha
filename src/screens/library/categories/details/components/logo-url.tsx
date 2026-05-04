import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

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
import { Text, Image, HStack, LabeledContent } from '@expo/ui/swift-ui';

import type { CategoryEditParams } from '@screens/library/categories';

type Props = {
	logoUrl: CategoryEditParams['logo_url'];
	openImagePicker: () => void;
	resetLogoUrl: () => void;
};

const LogoUrl = ({ logoUrl, openImagePicker, resetLogoUrl }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<LabeledContent
			label={t('library.details.fields.logo_url')}
			modifiers={[
				contentShape(shapes.rectangle()),
				onTapGesture(openImagePicker),
				...swipeActions({
					actions: [
						{
							id: 'delete',
							enabled: Boolean(logoUrl),
							systemImage: 'pencil.and.outline',
							tint: theme.semantic.error,
							onPress: resetLogoUrl,
							label: 'Clear'
						}
					]
				})
			]}
		>
			<HStack spacing={8}>
				{logoUrl ? (
					<Image
						uiImage={logoUrl}
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
			</HStack>
		</LabeledContent>
	);
};

export default LogoUrl;
