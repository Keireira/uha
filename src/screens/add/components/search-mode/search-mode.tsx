import React from 'react';
import { useRouter } from 'expo-router';

import { useSearch } from '@screens/add/hooks';

import { ResultSection, TopHitCard, NoResults, Loader } from './components';
import { ScreenTitle } from './search-mode.styles';

import type { SearchResultT } from '@api/soup/soup.d';

const SearchMode = () => {
	const router = useRouter();
	const { results, isLoading, isFilled } = useSearch();

	const [topHit, ...restResults] = results.length ? results : [];
	const { inHouseResults, externalResults } = restResults.reduce(
		(acc, result) => {
			if (result.source === 'local') {
				acc.inHouseResults.push(result);
			} else {
				acc.externalResults.push(result);
			}

			return acc;
		},
		{ inHouseResults: [], externalResults: [] } as Record<'inHouseResults' | 'externalResults', SearchResultT[]>
	);

	const goToNewService = (result: SearchResultT) => {
		router.push({
			pathname: '/add-subscription',
			params: {
				service_id: result.id,
				service_name: result.name,
				service_logo: result.logo_url,
				service_source: result.source
			}
		});
	};

	const isFetching = isLoading && isFilled && !results.length;
	const areNoResults = !isLoading && isFilled && !results.length;
	const withResults = !isFetching && isFilled && results.length > 0;

	return (
		<>
			<ScreenTitle>Search Results</ScreenTitle>

			{isFetching && <Loader />}

			{areNoResults && <NoResults />}

			{withResults && (
				<>
					{topHit && <TopHitCard {...topHit} onPress={goToNewService} />}
					<ResultSection label="Verified" results={inHouseResults} onPress={goToNewService} />
					<ResultSection label="External" results={externalResults} onPress={goToNewService} />
				</>
			)}
		</>
	);
};

export default SearchMode;
