import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';

import { Host, Text, ContentUnavailableView, VStack, HStack, Image } from '@expo/ui/swift-ui';
import { font, frame, padding, glassEffect, onTapGesture, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

const NoResults = () => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useAccent();

	const addSubscription = () => {
		router.push('/add-subscription');
	};

	return (
		<Host matchContents>
			<VStack alignment="center">
				<ContentUnavailableView
					title="No Services Found"
					description="Try adjusting your search "
					systemImage="magnifyingglass"
					modifiers={[frame({ height: 300 })]}
				/>

				<HStack
					spacing={12}
					modifiers={[
						padding({ horizontal: 18, vertical: 16, trailing: 22 }),
						onTapGesture(addSubscription),
						glassEffect({
							glass: { interactive: true, variant: 'regular' },
							shape: 'capsule'
						})
					]}
				>
					<Image color={settingAccent} systemName="plus" />

					<Text modifiers={[foregroundStyle(theme.text.primary), font({ size: 17, design: 'rounded' })]}>
						Create Custom Subscription
					</Text>
				</HStack>
			</VStack>
		</Host>
	);
};

export default NoResults;
