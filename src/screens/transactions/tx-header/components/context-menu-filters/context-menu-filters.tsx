import React from 'react';
import { useAppModel } from '@models';
import { useUnit } from 'effector-react';
import { ContextMenu, Switch, Button } from '@expo/ui/swift-ui';

import type { Props } from './context-menu-filters.d';

const ContextMenuFilters = ({ entries, filterType, triggerLabel }: Props) => {
	const { lenses } = useAppModel();
	const lensesStore = useUnit(lenses.$store);

	return (
		<ContextMenu dismissBehavior="disabled">
			<ContextMenu.Items>
				{entries.map((entry) => (
					<Switch
						key={entry.id}
						label={entry.title}
						// @TODO: I dislike it. Refactor later
						value={lensesStore.filters.some((filter) => filter.type === filterType && filter.value === entry.id)}
						onValueChange={(value) => {
							if (value) {
								lenses.filters.add({ type: filterType, value: entry.id });
							} else {
								lenses.filters.remove({ type: filterType, value: entry.id });
							}
						}}
					/>
				))}
			</ContextMenu.Items>

			<ContextMenu.Trigger>
				<Button systemImage="camera.filters">{triggerLabel}</Button>
			</ContextMenu.Trigger>
		</ContextMenu>
	);
};

export default ContextMenuFilters;
