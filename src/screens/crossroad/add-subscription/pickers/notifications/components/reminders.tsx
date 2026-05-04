import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { selectHasTrial } from '@screens/crossroad/add-subscription/events';

import { Section, Toggle, Text } from '@expo/ui/swift-ui';
import { tint, font, disabled } from '@expo/ui/swift-ui/modifiers';

const Reminders = ({ isGranted }: { isGranted: boolean }) => {
	const settingAccent = useAccent();

	const timeline = useDraftStore((state) => state.timeline);

	const { isEnabled, setEnabled } = useDraftStore(
		useShallow((state) => ({
			isEnabled: state.notify_enabled,
			setEnabled: state.actions.setNotifyEnabled
		}))
	);

	const { isBeforeTrialEnds, setBeforeTrialEnds } = useDraftStore(
		useShallow((state) => ({
			isBeforeTrialEnds: state.notify_trial_end,
			setBeforeTrialEnds: state.actions.setNotifyTrialEnd
		}))
	);

	const withTrial = selectHasTrial(timeline);

	return (
		<Section
			title="Reminders"
			footer={
				isGranted ? null : (
					<Text modifiers={[font({ size: 14, design: 'rounded' })]}>
						You have to allow notifications to use this feature.
					</Text>
				)
			}
		>
			<Toggle
				label="Notify me before payment"
				modifiers={[tint(settingAccent), disabled(!isGranted)]}
				onIsOnChange={setEnabled}
				isOn={isEnabled}
			/>

			{isEnabled && withTrial && (
				<Toggle
					label="Notify me before trial ends"
					modifiers={[tint(settingAccent), disabled(!isGranted)]}
					onIsOnChange={setBeforeTrialEnds}
					isOn={isBeforeTrialEnds}
				/>
			)}
		</Section>
	);
};

export default Reminders;
