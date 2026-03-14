import React, { useMemo } from 'react';

import { useSettingsValue } from '@hooks';
import { useTheme } from 'styled-components/native';

import AccentBar from './accent-bar';
import Root from './accent-spectrum.styles';

import type { AccentT } from '@themes';

const AccentSpectrum = () => {
	const theme = useTheme();
	const settingAccent = useSettingsValue<AccentT>('accent');
	const accents = useMemo(() => Object.keys(theme.accents) as unknown as AccentT[], [theme.accents]);

	return (
		<Root>
			{accents.map((accent) => (
				<AccentBar key={accent} accent={accent} isActive={settingAccent === accent} />
			))}
		</Root>
	);
};

export default AccentSpectrum;
