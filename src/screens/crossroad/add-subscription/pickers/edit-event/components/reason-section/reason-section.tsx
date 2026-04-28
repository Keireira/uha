import React from 'react';
import { useTheme } from 'styled-components/native';

import { TextField } from '@expo/ui/swift-ui';
import { font, lineLimit, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { EVENT_REASON_PLACEHOLDERS, isReasonEventType } from '@screens/crossroad/add-subscription/events';

import type { Props } from './reason-section.d';

const ReasonSection = ({ activeType, reason, setReason }: Props) => {
	const theme = useTheme();

	return (
		<TextField
			axis="vertical"
			defaultValue={reason}
			onValueChange={setReason}
			placeholder={activeType && isReasonEventType(activeType) ? EVENT_REASON_PLACEHOLDERS[activeType] : 'Why?'}
			modifiers={[
				font({ design: 'rounded', size: 17 }),
				lineLimit(4, { reservesSpace: true }),
				foregroundStyle(theme.text.primary)
			]}
		/>
	);
};

export default ReasonSection;
