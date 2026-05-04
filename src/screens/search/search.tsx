import React from 'react';

import { useSearch } from './hooks';

import Root from './search.styles';
import { Crossroad, SearchMode } from './components';

const SearchCrossroad = () => {
	const { isSearchMode } = useSearch();

	if (isSearchMode) {
		return (
			<Root>
				<SearchMode />
			</Root>
		);
	}

	return <Crossroad />;
};

export default SearchCrossroad;
