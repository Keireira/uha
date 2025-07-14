import React, { useState } from 'react';

import { View } from 'react-native';
import { BottomSheet, Picker } from '@expo/ui/swift-ui';
import { Trigger, TriggerText } from './drumroll.styles';

import type { AccessoryDrumrollT } from './drumroll.d';

const DrumrollAccessory = ({ actions, selectedIndex, trigger, onPress }: AccessoryDrumrollT) => {
	const [isOpened, setIsOpened] = useState(false);

	return (
		<View>
			<BottomSheet isOpened={isOpened} onIsOpenedChange={setIsOpened}>
				{/*
					Without setting height of the child, BottomSheet does not work correctly:
					The further down we scroll, the smaller in height BottomSheet became.
					Definitely a bug in the alpha version of expo/ui

					@TODO: Check if it's fixed in the next version
				*/}
				<View style={{ minHeight: 200 }}>
					<Picker
						options={actions.map((action) => action.title)}
						variant="wheel"
						selectedIndex={selectedIndex}
						onOptionSelected={onPress}
						style={{ minHeight: 200 }}
					/>
				</View>
			</BottomSheet>

			<Trigger onPress={() => setIsOpened(true)}>
				<TriggerText>{trigger}</TriggerText>
			</Trigger>
		</View>
	);
};

export default DrumrollAccessory;
