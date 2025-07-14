import React from 'react';

import { SwitchAccessory, DrumrollAccessory, ContextMenuAccessory, PlainActionAccessory } from '../accessories';
import Root, { ListItemContent, ListItemLeft, ListItemRight, ListItemTitle } from './list-item.styles';

import type { Props } from './list-item.d';

const ListItemComponent = ({ title, accessory }: Props) => {
	const switchKey = accessory.type === 'switch' ? `switch-${accessory.value}` : undefined;

	return (
		<Root>
			<ListItemContent>
				<ListItemLeft>
					<ListItemTitle>{title}</ListItemTitle>
				</ListItemLeft>

				<ListItemRight>
					{accessory.type === 'switch' && <SwitchAccessory key={switchKey} {...accessory} />}
					{accessory.type === 'context-menu' && <ContextMenuAccessory {...accessory} />}
					{accessory.type === 'drumroll' && <DrumrollAccessory {...accessory} />}
					{accessory.type === 'plain-action' && <PlainActionAccessory {...accessory} />}
				</ListItemRight>
			</ListItemContent>
		</Root>
	);
};

export default ListItemComponent;
