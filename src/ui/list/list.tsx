import React from 'react';

import { LegendList } from '@legendapp/list';
import ListSectionComponent from './list-section';
import type { Props } from './list.d';
import type { Props as ListSectionProps } from './list-section';
import type { LegendListRenderItemProps } from '@legendapp/list';

const renderItem = ({ item }: LegendListRenderItemProps<ListSectionProps>) => {
	return <ListSectionComponent key={item.id} {...item} />;
};

const List = ({ sections, style }: Props) => {
	return (
		<LegendList
			data={sections}
			renderItem={renderItem}
			keyExtractor={(item) => item.id || item.title || 'section'}
			recycleItems
			style={style}
		/>
	);
};

export default List;
