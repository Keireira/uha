import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useSettingsValue } from '@hooks';
import { useSearch } from '@screens/add/hooks';

import { NoResults } from '@elements';
import { ScreenTitle } from './search-mode.styles';
import { ResultSection, TopHitCard, Loader } from './components';

import type { SearchResultT } from '@api/soup/soup.d';

const SearchMode = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const { results, isLoading, isFilled } = useSearch();
	const language = useSettingsValue<string>('playstore_lang');
	const appStoreCountry = useSettingsValue<string>('appstore_country');
	const playStoreCountry = useSettingsValue<string>('playstore_country');

	const [topHit, ...restResults] = results.length ? results : [];
	const { inHouseResults, externalResults } = restResults.reduce(
		(acc, result) => {
			if (result.source === 'inhouse') {
				acc.inHouseResults.push(result);
			} else {
				acc.externalResults.push(result);
			}

			return acc;
		},
		{ inHouseResults: [], externalResults: [] } as Record<'inHouseResults' | 'externalResults', SearchResultT[]>
	);

	const goToNewService = (searchResult: SearchResultT) => {
		const isInNeedForHint = searchResult.source !== 'inhouse';

		const additionalParams = isInNeedForHint
			? {
					source_hint: searchResult.source,
					country: searchResult.source === 'appstore' ? appStoreCountry : playStoreCountry,
					language: searchResult.source === 'playstore' ? language : undefined
				}
			: {};

		router.push({
			pathname: '/add-subscription',
			params: {
				service_id: searchResult.id,
				service_name: searchResult.name,
					service_logo: searchResult.logo_url,
					service_source: searchResult.source,
					service_bundle_id: searchResult.bundle_id,
					service_slug: searchResult.slug,
					service_color: searchResult.colors?.primary,
					service_ref_link: searchResult.ref_link,
					service_category_slug: searchResult.category_slug,
					service_domains: JSON.stringify(searchResult.domains ?? []),
					service_aliases: JSON.stringify(searchResult.alternative_names ?? []),
					service_social_links: JSON.stringify(searchResult.social_links ?? {}),
					...additionalParams
				}
			});
	};

	const isFetching = isLoading && isFilled && !results.length;
	const areNoResults = !isLoading && isFilled && !results.length;
	const withResults = !isFetching && isFilled && results.length > 0;

	return (
		<>
			<ScreenTitle>{t('crossroad.add.search_results')}</ScreenTitle>

			{isFetching && <Loader />}

			{areNoResults && <NoResults />}

			{withResults && (
				<>
					{topHit && <TopHitCard {...topHit} onPress={goToNewService} />}

					<ResultSection
						label={t('crossroad.add.sections.verified')}
						results={inHouseResults}
						onPress={goToNewService}
					/>

					<ResultSection
						label={t('crossroad.add.sections.external')}
						results={externalResults}
						onPress={goToNewService}
					/>
				</>
			)}
		</>
	);
};

export default SearchMode;
