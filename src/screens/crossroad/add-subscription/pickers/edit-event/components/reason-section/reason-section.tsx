import React from 'react';
import { useTheme } from 'styled-components/native';

import { TextField } from '@expo/ui/swift-ui';
import { font, lineLimit, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

import type { EventTypeT } from '@screens/crossroad/add-subscription/events';
import type { Props } from './reason-section.d';

const PLACEHOLDER_LABELS: Partial<Record<EventTypeT, string>> = {
	pause: 'Why did you pause?',
	cancellation: 'Why did you cancel?'
};

const ReasonSection = ({ activeType, reason, setReason }: Props) => {
	const theme = useTheme();

	return (
		<TextField
			axis="vertical"
			defaultValue={reason}
			onValueChange={setReason}
			placeholder={activeType ? PLACEHOLDER_LABELS[activeType] : 'Why?'}
			modifiers={[font({ size: 17 }), lineLimit(4, { reservesSpace: true }), foregroundStyle(theme.text.primary)]}
		/>
	);
};

export default ReasonSection;
