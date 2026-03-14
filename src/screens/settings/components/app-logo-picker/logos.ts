import type { AppLogoT } from './app-logo-picker.d';

const APP_LOGOS: AppLogoT[] = [
	{
		key: 'DEFAULT',
		source: require('@assets/images/ios-light.png'),
		tint: '#30D158'
	},
	{
		key: 'enby',
		source: require('@assets/images/enby-icon.png'),
		tint: '#BF5AF2'
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
		tint: '#FFD60A'
	}
];

export default APP_LOGOS;
