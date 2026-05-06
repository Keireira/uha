import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { Toggle, Text } from '@expo/ui/swift-ui';
import { font, foregroundStyle, tint } from '@expo/ui/swift-ui/modifiers';

type Props = {
	notifyEnabled: boolean;
	notifyDaysBefore: number;
	onChangeNotifyEnabled: (value: boolean) => void;
};

const Notifications = ({ notifyEnabled, notifyDaysBefore, onChangeNotifyEnabled }: Props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();

	const preview =
		notifyEnabled && notifyDaysBefore > 0
			? `${notifyDaysBefore} ${notifyDaysBefore === 1 ? 'day' : 'days'} before`
			: 'Off';

	return (
		<>
			<Toggle
				isOn={notifyEnabled}
				label={t('library.details.fields.notify_enabled')}
				onIsOnChange={onChangeNotifyEnabled}
				modifiers={[tint(settingAccent)]}
			/>

			<Text modifiers={[font({ design: 'rounded', size: 15 }), foregroundStyle(theme.text.secondary)]}>{preview}</Text>
		</>
	);
};

export default Notifications;
