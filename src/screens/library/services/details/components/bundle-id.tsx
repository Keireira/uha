import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { font, foregroundStyle, multilineTextAlignment } from '@expo/ui/swift-ui/modifiers';
import { TextField, LabeledContent } from '@expo/ui/swift-ui';

import type { ServiceEditParams } from '@screens/library/services';

type Props = {
	bundleId: ServiceEditParams['bundle_id'];
	onChangeBundleId: (value: string) => void;
};

const BundleId = ({ bundleId, onChangeBundleId }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<LabeledContent
			label={t('library.details.fields.bundle_id')}
			modifiers={[font({ size: 16, weight: 'regular', design: 'rounded' })]}
		>
			<TextField
				defaultValue={bundleId}
				placeholder="com.example.app"
				onValueChange={onChangeBundleId}
				modifiers={[
					multilineTextAlignment('trailing'),
					foregroundStyle(theme.text.secondary),
					font({ size: 16, weight: 'regular', design: 'rounded' })
				]}
			/>
		</LabeledContent>
	);
};

export default BundleId;
