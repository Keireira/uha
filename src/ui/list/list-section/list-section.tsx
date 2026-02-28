import React from 'react';

import ListItemComponent from '../list-item';
import { FlashList } from '@shopify/flash-list';
import {
	ListSection,
	SectionHeader,
	GroupedListContainer,
	GroupedListItem,
	SectionBottomText
} from './list-section.styles';

import type { Props } from './list-section.d';
import type { Props as ListItemProps } from '../list-item';
import type { ListRenderItemInfo } from '@shopify/flash-list';

const renderItem = ({
	item,
	index,
	extraData
}: ListRenderItemInfo<ListItemProps> & { extraData?: { arrLength: number } }) => {
	const arrLength = extraData?.arrLength ?? 0;

	return (
		<GroupedListItem key={item.id} $isFirst={index === 0} $isLast={index === arrLength - 1}>
			<ListItemComponent {...item} />
		</GroupedListItem>
	);
};

const ListSectionComponent = ({ title, innerArray, bottomText }: Props) => {
	return (
		<ListSection>
			{Boolean(title) && <SectionHeader>{title}</SectionHeader>}

			<GroupedListContainer>
				<FlashList
					scrollEnabled={false}
					data={innerArray}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					extraData={{
						arrLength: innerArray.length
					}}
				/>
			</GroupedListContainer>

			{Boolean(bottomText) && <SectionBottomText>{bottomText}</SectionBottomText>}
		</ListSection>
	);
};

export default ListSectionComponent;
