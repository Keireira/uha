import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAccent, useGlassStyle } from '@hooks';
import { withAlpha } from '@lib/colors';
import { WrapHStack } from '@modules/wrap-hstack';

import { useSyncWithService, computeSyncDiff, hasSyncDiff } from '../hooks';
import { HStack, RNHostView, Section, Text } from '@expo/ui/swift-ui';
import {
	font,
	foregroundStyle,
	glassEffect,
	listRowBackground,
	listRowSeparator,
	listSectionSpacing,
	padding
} from '@expo/ui/swift-ui/modifiers';
import { SymbolView } from 'expo-symbols';
import Root, { ButtonInner, ButtonLabel, FooterText } from './sync.styles';

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
	const glassEffectStyle = useGlassStyle();
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
				<RNHostView matchContents>
					<>
						<Root glassEffectStyle={glassEffectStyle}>
							<ButtonInner onPress={onPress} $tintColor={settingAccent}>
								<SymbolView name="arrow.triangle.2.circlepath" size={16} tintColor={settingAccent} weight="bold" />

								<ButtonLabel $tintColor={settingAccent}>{t('library.details.sync.apply')}</ButtonLabel>
							</ButtonInner>
						</Root>

						<FooterText>{t('library.details.sync.footer', { service: service.title })}</FooterText>
					</>
				</RNHostView>
			</Section>
		</>
	);
};

export default Sync;
