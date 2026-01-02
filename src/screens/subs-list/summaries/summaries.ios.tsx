import React from 'react';

import { Text } from '@ui';
import Root from './summaries.styles';

const Summaries = () => {
	return (
		<Root>
			<Text>$120.30</Text>
			<Text $bold>In January</Text>

			<Text>$220.30</Text>
			<Text $bold>In 2026</Text>
		</Root>
	);
};

export default Summaries;
