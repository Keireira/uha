import React from 'react';

import ListItemComponent from '../list-item';
import { LegendList } from '@legendapp/list';
import {
	ListSection,
	SectionHeader,
	GroupedListContainer,
	GroupedListItem,
	SectionBottomText
} from './list-section.styles';

import type { Props } from './list-section.d';
import type { Props as ListItemProps } from '../list-item';
import type { LegendListRenderItemProps } from '@legendapp/list';

const renderItem = ({ item, index, extraData }: LegendListRenderItemProps<ListItemProps>) => {
	return (
		<GroupedListItem key={item.id} $isFirst={index === 0} $isLast={index === extraData.arrLength - 1}>
			<ListItemComponent {...item} />
		</GroupedListItem>
	);
};

const ListSectionComponent = ({ title, innerArray, bottomText }: Props) => {
	return (
		<ListSection>
			{Boolean(title) && <SectionHeader>{title}</SectionHeader>}

			<GroupedListContainer>
				<LegendList
					scrollEnabled={false}
					data={innerArray}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					recycleItems
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
