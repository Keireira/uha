import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';
import { WrapHStack } from '@modules/wrap-hstack';

import { useSyncWithService, computeSyncDiff, hasSyncDiff } from '../hooks';
import { Button, HStack, Image, Section, Text, VStack } from '@expo/ui/swift-ui';
import {
	buttonStyle,
	font,
	frame,
	foregroundStyle,
	glassEffect,
	listRowBackground,
	listRowSeparator,
	listSectionSpacing,
	padding
} from '@expo/ui/swift-ui/modifiers';

import type { ServiceT, SubscriptionT } from '@models';
import type { LogoDraftT } from '@screens/crossroad/add-subscription/events';

type Props = {
	subscription: SubscriptionT;
	service: ServiceT;
	customName: string;
	logo: LogoDraftT;
};

const Sync = ({ subscription, service, customName, logo }: Props) => {
	const settingAccent = useAccent();
	const { t } = useTranslation();
	const applyToService = useSyncWithService();

	const draftSlice = { custom_name: customName, logo };
	const diff = computeSyncDiff(service, draftSlice);
	if (!hasSyncDiff(diff)) {
		return null;
	}

	const diffLines: string[] = [];
	if (diff.title) diffLines.push(t('library.details.sync.diff.title'));
	if (diff.logo) diffLines.push(t('library.details.sync.diff.logo'));
	if (diff.symbol) diffLines.push(t('library.details.sync.diff.symbol'));

	const onPress = () => {
		applyToService(subscription, service, draftSlice);
	};

	return (
		<>
			<Section title={t('library.details.section.sync')}>
				<WrapHStack spacing={8} lineSpacing={8} modifiers={[padding({ vertical: 4 })]}>
					{diffLines.map((line) => (
						<HStack
							key={line}
							modifiers={[
								padding({ vertical: 7, horizontal: 12 }),
								foregroundStyle(settingAccent),
								glassEffect({
									glass: {
										variant: 'regular',
										tint: withAlpha(settingAccent, 0.16)
									},
									shape: 'capsule'
								})
							]}
						>
							<Text modifiers={[font({ size: 14, weight: 'semibold', design: 'rounded' })]}>{line}</Text>
						</HStack>
					))}
				</WrapHStack>
			</Section>

			<Section modifiers={[listRowBackground('transparent'), listRowSeparator('hidden'), listSectionSpacing(0)]}>
				<VStack spacing={4} modifiers={[padding({ horizontal: 16, top: 10 })]}>
					<Button onPress={onPress} modifiers={[buttonStyle('borderless')]}>
						<HStack
							spacing={8}
							alignment="center"
							modifiers={[
								frame({ maxWidth: Number.POSITIVE_INFINITY }),
								padding({ vertical: 14, horizontal: 16 }),
								foregroundStyle(settingAccent),
								glassEffect({
									glass: {
										interactive: true,
										variant: 'regular',
										tint: withAlpha(settingAccent, 0.14)
									},
									shape: 'roundedRectangle',
									cornerRadius: 14
								})
							]}
						>
							<Image systemName="arrow.triangle.2.circlepath" size={16} color={settingAccent} />

							<Text modifiers={[font({ design: 'rounded', size: 15, weight: 'semibold' })]}>
								{t('library.details.sync.apply')}
							</Text>
						</HStack>
					</Button>

					<Text
						modifiers={[
							padding({ horizontal: 16 }),
							font({ design: 'rounded', size: 12, weight: 'regular' }),
							foregroundStyle('#8E8E93')
						]}
					>
						{t('library.details.sync.footer', { service: service.title })}
					</Text>
				</VStack>
			</Section>
		</>
	);
};

export default Sync;
