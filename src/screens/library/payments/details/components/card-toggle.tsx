import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAccent } from '@hooks';

import { Toggle } from '@expo/ui/swift-ui';
import { tint, contentShape, shapes } from '@expo/ui/swift-ui/modifiers';

import type { PaymentEditParams } from '@screens/library/payments';

type Props = {
	isCard: PaymentEditParams['is_card'];
	onChangeIsCard: (value: boolean) => void;
};

const CardToggle = ({ isCard, onChangeIsCard }: Props) => {
	const { t } = useTranslation();
	const settingAccent = useAccent();

	return (
		<Toggle
			label={t('library.details.fields.card')}
			modifiers={[contentShape(shapes.rectangle()), tint(settingAccent)]}
			isOn={isCard}
			onIsOnChange={onChangeIsCard}
		/>
	);
};

export default CardToggle;
