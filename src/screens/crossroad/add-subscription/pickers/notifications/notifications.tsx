import React from 'react';

import { useAccent } from '@hooks';
import { useNotificationsPermission } from '@lib/notifications';

import { Header, HeroBanner, Reminders, DurationPicker } from './components';
import { Host, List } from '@expo/ui/swift-ui';
import { tint, listStyle, environment } from '@expo/ui/swift-ui/modifiers';

const NotificationsScreen = () => {
	const settingAccent = useAccent();
	const permissions = useNotificationsPermission();

	return (
		<>
			<Header />

			<Host style={{ flex: 1 }} useViewportSizeMeasurement>
				<List modifiers={[listStyle('insetGrouped'), environment('editMode', 'active'), tint(settingAccent)]}>
					<HeroBanner {...permissions} />

					<Reminders isGranted={permissions.isGranted} />

					<DurationPicker />
				</List>
			</Host>
		</>
	);
};

export default NotificationsScreen;
