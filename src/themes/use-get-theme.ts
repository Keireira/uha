import { useSettingsValue } from '@hooks';
import darkTheme from './dark';
import lightTheme from './light';
import oledTheme from './oled';

const useGetTheme = () => {
	const isOledTheme = useSettingsValue<boolean>('oled_mode');
	const theme = useSettingsValue<'dark' | 'light'>('theme');

	if (theme === 'dark') {
		return isOledTheme ? oledTheme : darkTheme;
	}

	return lightTheme;
};

export default useGetTheme;
