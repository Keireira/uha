// import React, { useState } from 'react';

// import { Text } from '@ui';
// import { Button as NButton } from 'react-native';
// import Root from './upper-phase.styles';
// import { Host, BottomSheet, Button, Text, VStack, Group } from '@expo/ui/swift-ui';
// import { presentationDetents, presentationBackgroundInteraction } from '@expo/ui/swift-ui/modifiers';

// const UpperPhase = () => {
// 	const [isPresented, setIsPresented] = useState(false);

// 		<Root>

// 			<NButton title="Open Sheet" onPress={() => setIsPresented(true)} />

// 			<Host>
// 				<BottomSheet isPresented={isPresented} onIsPresentedChange={setIsPresented}>
// 					<Group
// 						modifiers={[
// 							presentationDetents(['medium', 'large', { fraction: 0.3 }, { height: 200 }]),
// 							presentationBackgroundInteraction({ type: 'enabledUpThrough', detent: 'medium' })
// 						]}
// 					>
// 						<Text>This sheet can snap to multiple heights.</Text>
// 					</Group>
// 				</BottomSheet>
// 			</Host>
// 		</Root>
// 	);
// };

// export default UpperPhase;
