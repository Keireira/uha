import React from 'react';

import { useSearch } from './hooks';

import { Crossroad, SearchMode } from './components';
import Root from './add.styles';

const AddCrossroad = () => {
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

export default AddCrossroad;
