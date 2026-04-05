import React from 'react';

import { useSearch } from './hooks';

import { Crossroad, SearchMode } from './components';
import Root from './add.styles';

const AddCrossroad = () => {
	const { isSearchMode } = useSearch();

	return <Root>{isSearchMode ? <SearchMode /> : <Crossroad />}</Root>;
};

export default AddCrossroad;
