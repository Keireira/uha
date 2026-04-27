import { useTheme } from 'styled-components/native';

const useGlassStyle = () => {
	const theme = useTheme();

	const glassEffectStyle = !theme.is_oled && theme.tint === 'dark' ? 'regular' : 'clear';

	return glassEffectStyle;
};

export default useGlassStyle;
