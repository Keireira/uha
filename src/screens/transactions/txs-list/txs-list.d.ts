import type { UseTranslationResponse } from 'react-i18next';

export type TI18nT = UseTranslationResponse<string, undefined>['t'];

export type HeaderSectionT = {
	type: 'sectionHeader';
	date: string;
	total: string | null;
};
