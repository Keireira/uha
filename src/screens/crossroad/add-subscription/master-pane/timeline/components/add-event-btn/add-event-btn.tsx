import React from 'react';
import { useAccent, useGlassStyle } from '@hooks';

import { SymbolView } from 'expo-symbols';
import Root, { InnerBtn, Label } from './add-event-btn.styles';

import type { Props } from './add-event-btn.d';

const AddEventButton = ({ setIsPickerVisible }: Props) => {
	const settingAccent = useAccent();
	const glassEffectStyle = useGlassStyle();

	const openTypePicker = () => setIsPickerVisible(true);

	return (
		<Root glassEffectStyle={glassEffectStyle}>
			<InnerBtn onPress={openTypePicker} $tintColor={settingAccent}>
				<SymbolView name="plus" size={16} tintColor={settingAccent} weight="bold" />

				<Label $tintColor={settingAccent}>Add event</Label>
			</InnerBtn>
		</Root>
	);
};

export default AddEventButton;
