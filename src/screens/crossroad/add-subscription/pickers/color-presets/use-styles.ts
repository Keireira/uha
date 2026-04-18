import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

import { withAlpha } from '@lib/colors';

const useStyles = () => {
	const theme = useTheme();

	return StyleSheet.create({
		picker: {
			width: '100%',
			gap: 12,
			borderRadius: 16,
			overflow: 'hidden'
		},
		panel: {
			borderRadius: 0,
			height: 200,
			margin: -12
		},
		panelThumbInner: {
			backgroundColor: withAlpha(theme.static.pure_white, 0.25),
			borderColor: withAlpha(theme.static.pure_white, 0.7),
			borderWidth: 2
		},
		slider: {
			borderRadius: 8,
			marginTop: 24
		},
		sliderThumbInner: {
			backgroundColor: withAlpha(theme.static.pure_white, 0.3),
			borderColor: withAlpha(theme.static.pure_white, 0.8),
			borderWidth: 2,
			shadowColor: theme.static.pure_black,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 4
		},
		swatchesContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 10,
			paddingHorizontal: 2,
			justifyContent: 'flex-start'
		},
		swatch: {
			width: 40,
			height: 40,
			borderRadius: 25,
			borderWidth: 1.5,
			borderColor: withAlpha(theme.border.default, 0.1),
			shadowColor: theme.static.pure_black,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 6,
			marginBottom: 0,
			marginHorizontal: 0
		},
		inputContainer: {
			gap: 8
		},
		input: {
			backgroundColor: withAlpha(theme.surface.default, 0.094),
			borderRadius: 8,
			borderWidth: 0.5,
			borderColor: withAlpha(theme.border.default, 0.1),
			color: withAlpha(theme.text.primary, 0.922),
			fontSize: 17,
			fontFamily: 'Nunito',
			fontWeight: '400',
			paddingHorizontal: 12,
			paddingVertical: 18,
			textAlign: 'center',
			letterSpacing: 1,
			textTransform: 'uppercase'
		},
		inputTitle: {
			display: 'none'
		}
	});
};

export default useStyles;
