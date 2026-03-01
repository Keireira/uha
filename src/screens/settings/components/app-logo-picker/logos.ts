import type { AppLogoT } from './app-logo-picker.d';

const APP_LOGOS: AppLogoT[] = [
	{
		key: 'DEFAULT',
		source: require('@assets/images/ios-light.png'),
		tint: '#FFD60A'
	},
	{
		key: 'enby',
		source: require('@assets/images/enby-icon.png'),
		tint: '#5E5CE6'
	},
	{
		key: 'trans',
		source: require('@assets/images/trans-icon.png'),
		tint: '#64D2FF'
	},
	{
		key: 'lesbi',
		source: require('@assets/images/lesbi-icon.png'),
		tint: '#FF375F'
	},
	{
		key: 'pan',
		source: require('@assets/images/pan-icon.png'),
		tint: '#63E6E2'
	}
];

export default APP_LOGOS;
