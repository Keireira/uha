import React from 'react';
import { useTheme } from 'styled-components/native';

import { Section, TextField } from '@expo/ui/swift-ui';
import { font, lineLimit, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

import type { Props } from './reason-section.d';

const ReasonSection = ({ activeType, cancellationReason, setCancellationReason }: Props) => {
	const theme = useTheme();

	return (
		<Section title="Reason (optional)">
			<TextField
				axis="vertical"
				defaultValue={cancellationReason}
				onValueChange={setCancellationReason}
				placeholder={activeType === 'pause' ? 'Why did you pause?' : 'Why did you cancel?'}
				modifiers={[font({ size: 15 }), lineLimit(4, { reservesSpace: true }), foregroundStyle(theme.text.primary)]}
			/>
		</Section>
	);
};

export default ReasonSection;
