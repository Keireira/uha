import React from 'react';

import ListItemComponent from '../list-item';
import { LegendList } from '@legendapp/list';
import { ListSection, SectionHeader, GroupedListContainer, GroupedListItem } from './list-section.styles';

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

const ListSectionComponent = ({ title, innerArray }: Props) => {
	return (
		<ListSection>
			{Boolean(title) && <SectionHeader>{title}</SectionHeader>}

			<GroupedListContainer>
				<LegendList
					data={innerArray}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					recycleItems={false}
					extraData={{
						arrLength: innerArray.length
					}}
				/>
			</GroupedListContainer>
		</ListSection>
	);
};

export default ListSectionComponent;
