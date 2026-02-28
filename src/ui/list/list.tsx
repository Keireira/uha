import React from 'react';

import { FlashList } from '@shopify/flash-list';
import ListSectionComponent from './list-section';

import type { Props } from './list.d';
import type { Props as ListSectionProps } from './list-section';
import type { ListRenderItemInfo } from '@shopify/flash-list';

const renderItem = ({ item }: ListRenderItemInfo<ListSectionProps>) => {
	return <ListSectionComponent key={item.id} {...item} />;
};

const List = ({ sections, style }: Props) => {
	return (
		<FlashList
			scrollEnabled={false}
			data={sections}
			renderItem={renderItem}
			keyExtractor={(item) => item.id || item.title || 'section'}
			style={style}
		/>
	);
};

export default List;
