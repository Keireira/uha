import { useTheme } from 'styled-components/native';
import { useSettingsValue } from '@hooks';

import type { UserT } from '@models';

const useAccent = () => {
	const theme = useTheme();
	const accent = useSettingsValue<UserT['accent']>('accent');

	return theme.accents[accent];
};

export default useAccent;
