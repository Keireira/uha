import React, { useEffect } from 'react';
import { openSettings } from 'expo-linking';
import { useTheme } from 'styled-components/native';
import { requestNotifications, RESULTS } from 'react-native-permissions';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import {
	font,
	frame,
	padding,
	glassEffect,
	onTapGesture,
	foregroundStyle,
	listRowSeparator,
	listRowBackground,
	listSectionMargins
} from '@expo/ui/swift-ui/modifiers';
import { Section, Text, VStack, HStack, Image, Spacer } from '@expo/ui/swift-ui';

import type { SFSymbol } from 'expo-symbols';
import type { PermissionStatus } from 'react-native-permissions';
import type { UseNotificationsPermission } from '@lib/notifications';

type BannerT = {
	title: string;
	subtitle?: string;
	systemImage: SFSymbol;
};

const BANNERS: Partial<Record<PermissionStatus, BannerT>> = {
	[RESULTS.DENIED]: {
		title: 'Notifications are disabled',
		subtitle: 'Tap to enable',
		systemImage: 'bell.badge.fill'
	},
	[RESULTS.BLOCKED]: {
		title: 'Notifications are blocked',
		subtitle: 'Tap to open settings',
		systemImage: 'bell.slash.fill'
	},
	[RESULTS.UNAVAILABLE]: {
		title: 'Notifications are unavailable',
		systemImage: 'nosign'
	}
};

const HeroBanner = ({ status, isLoading, isBlocked, isGranted, isDenied }: UseNotificationsPermission) => {
	const theme = useTheme();

	const setNotifyEnabled = useDraftStore((state) => state.actions.setNotifyEnabled);

	useEffect(() => {
		if (!(isGranted || isLoading)) {
			setNotifyEnabled(false);
		}
	}, [isLoading, isGranted, setNotifyEnabled]);

	const handleNotifications = () => {
		if (isDenied) {
			requestNotifications();
		} else if (isBlocked) {
			openSettings();
		}
	};

	const banner = status ? BANNERS[status] : null;

	if (!banner) {
		return null;
	}

	return (
		<Section
			modifiers={[
				listRowSeparator('hidden'),
				listRowBackground('transparent'),
				listSectionMargins({ length: 0, edges: 'all' })
			]}
		>
			<HStack
				spacing={12}
				modifiers={[
					frame({ maxWidth: Number.POSITIVE_INFINITY }),
					padding({ horizontal: 18, vertical: 16 }),
					onTapGesture(handleNotifications),
					glassEffect({
						glass: { interactive: true, variant: 'clear' },
						shape: 'capsule'
					})
				]}
			>
				<Image color={theme.semantic.warning} systemName={banner.systemImage} />

				<VStack alignment="leading" spacing={4}>
					<Text modifiers={[foregroundStyle(theme.text.primary), font({ size: 17, design: 'rounded' })]}>
						{banner.title}
					</Text>

					{banner.subtitle && (
						<Text modifiers={[foregroundStyle(theme.text.secondary), font({ size: 13, design: 'rounded' })]}>
							{banner.subtitle}
						</Text>
					)}
				</VStack>
				<Spacer />
			</HStack>
		</Section>
	);
};

export default HeroBanner;
