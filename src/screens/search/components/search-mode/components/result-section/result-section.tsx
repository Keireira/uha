import React from 'react';

import RowResult from './row-result';
import Root, { Label, Card, Footer } from './result-section.styles';

import type { Props } from './result-section.d';

const ResultSection = ({ label, footer, results, onPress }: Props) => {
	if (results.length === 0) return null;

	return (
		<Root>
			<Label>{label}</Label>

			<Card>
				{results.map((result, i) => (
					<RowResult
						key={`${result.source}-${result.id}`}
						{...result}
						isLast={i === results.length - 1}
						onPress={onPress}
					/>
				))}
			</Card>

			{footer && <Footer>{footer}</Footer>}
		</Root>
	);
};

export default ResultSection;
