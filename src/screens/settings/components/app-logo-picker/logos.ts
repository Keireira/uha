import type { AppLogoT } from './app-logo-picker.d';

const APP_LOGOS: AppLogoT[] = [
	{
		key: 'DEFAULT',
		source: require('@assets/images/default.png'),
		tint: '#30D158'
	},
	{
		key: 'enby',
		source: require('@assets/alt-icons/enby.png'),
		tint: '#BF5AF2'
	},
	{
		key: 'trans',
		source: require('@assets/alt-icons/trans.png'),
		tint: '#64D2FF'
	},
	{
		key: 'lesbi',
		source: require('@assets/alt-icons/lesbi.png'),
		tint: '#FF375F'
	},
	{
		key: 'pan',
		source: require('@assets/alt-icons/pan.png'),
		tint: '#FFD60A'
	}
];

export default APP_LOGOS;
