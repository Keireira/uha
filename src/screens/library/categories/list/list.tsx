import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { asc, like } from 'drizzle-orm';

import db from '@db';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { ArrowLeftIcon } from '@ui/icons';
import Root, { CategoryRoot, Emoji, Title, Header, HeaderTitle, SectionLetter } from './list.styles';

import type { Props } from './list.d';

const CategoriesListScreen = ({ search }: Props) => {
	const router = useRouter();
	const theme = useTheme();

	const { data: categories } = useLiveQuery(
		db
			.select()
			.from(categoriesTable)
			.where(like(categoriesTable.title, `%${search.trim()}%`))
			.orderBy(asc(categoriesTable.title)),
		[search]
	);

	const navigateTo = () => {
		router.dismiss(1);
	};

	return (
		<Root>
			<Header hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={navigateTo}>
				<ArrowLeftIcon width={14} height={14} color={theme.text.tertiary} />
				<HeaderTitle>Library</HeaderTitle>
			</Header>

			{categories.map((category, index) => {
				const letter = category.title.charAt(0).toUpperCase();
				const prev = index > 0 ? categories[index - 1].title.charAt(0).toUpperCase() : '';

				return (
					<React.Fragment key={category.id}>
						{letter !== prev && <SectionLetter>{letter}</SectionLetter>}

						<CategoryRoot
							onPress={() =>
								router.push({ pathname: '/(tabs)/library/[id]', params: { id: category.id, type: 'category' } })
							}
						>
							<Emoji $color={category.color}>{category.emoji}</Emoji>
							<Title>{category.title}</Title>
						</CategoryRoot>
					</React.Fragment>
				);
			})}
		</Root>
	);
};

export default CategoriesListScreen;
