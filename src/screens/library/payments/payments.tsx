import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';

import { useAccent } from '@hooks';

import {
	font,
	padding,
	listStyle,
	listRowSeparator,
	listRowBackground,
	scrollTargetBehavior,
	scrollDismissesKeyboard,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import { Host, Text, HStack, List, Section, Button } from '@expo/ui/swift-ui';

import type { TextInputChangeEvent } from 'react-native';

const Payments = () => {
	const router = useRouter();
	const settingAccent = useAccent();
	const [, setSearchQuery] = useState('');

	const handleChangeText = (e: TextInputChangeEvent) => {
		setSearchQuery(e.nativeEvent.text.trim());
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button
					variant="plain"
					icon="chevron.backward"
					accessibilityLabel="Go back"
					onPress={() => router.replace('/(tabs)/library')}
					tintColor={settingAccent}
				/>
			</Stack.Toolbar>

			<Host style={{ flex: 1 }}>
				<List
					modifiers={[
						listStyle('insetGrouped'),
						scrollDismissesKeyboard('immediately'),
						scrollTargetBehavior('viewAligned'),
						scrollContentBackground('hidden')
					]}
				>
					<Section modifiers={[listRowSeparator('hidden', 'all'), listRowBackground('transparent')]}>
						{Array.from({ length: 25 }).map((_, index) => {
							return (
								<HStack key={index} spacing={14} modifiers={[padding({ vertical: 8, horizontal: 0 })]}>
									<Text modifiers={[font({ size: 20, design: 'rounded', weight: 'regular' })]}>
										Payment Method #{index + 1}
									</Text>

									<Button label="Go To" onPress={() => router.push('./test')} />
								</HStack>
							);
						})}
					</Section>
				</List>
			</Host>

			<Stack.Toolbar placement="bottom">
				<Stack.SearchBar
					autoFocus={false}
					inputType="text"
					autoCapitalize="none"
					placement="integratedButton"
					hideNavigationBar={false}
					onChangeText={handleChangeText}
					tintColor={settingAccent}
					placeholder="Filter payment methods"
				/>
			</Stack.Toolbar>
		</>
	);
};

export default Payments;
