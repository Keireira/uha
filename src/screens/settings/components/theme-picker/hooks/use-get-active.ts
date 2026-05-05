import { useSettingsValue } from '@hooks';

import type { UserT } from '@models';

const useGetActiveMode = () => {
	const currentTheme = useSettingsValue<UserT['theme']>('theme');
	const isOledEnabled = useSettingsValue<UserT['oled_mode']>('oled_mode');

	if (isOledEnabled && currentTheme === 'dark') {
		return 'oled';
	}

	return currentTheme;
};

export default useGetActiveMode;
