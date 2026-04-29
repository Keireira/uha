import React, { useState } from 'react';
import { Linking, Modal } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';

import { H6, SmallText } from '@ui';
import { LogViewer } from '@lib/logger';
import { SymbolView } from 'expo-symbols';
import Root, { Links, Pill, Inner, Version } from './footer.styles';

const Footer = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [logsVisible, setLogsVisible] = useState(false);

	const openSite = () => Linking.openURL('https://uha.app');
	const reportBug = () => Linking.openURL('https://github.com/Keireira/tuna/issues/new');
	// const openRepo = () => Linking.openURL('https://github.com/Keireira/uha');
	const joinTestFlight = () => Linking.openURL('https://testflight.apple.com/join/uVYrDkbA');

	return (
		<>
			<Root>
				<Links>
					{/*<Pill isInteractive>
						<Inner onPress={openRepo}>
							<H6 $color={theme.text.secondary} $weight={600}>
								{t('settings.about.sources')}
							</H6>

							<SymbolView name="arrow.up.right" size={10} weight="semibold" tintColor={theme.text.tertiary} />
						</Inner>
					</Pill>*/}

					<Pill isInteractive>
						<Inner onPress={reportBug}>
							<H6 $color={theme.text.secondary} $weight={600}>
								{t('settings.about.bug')}
							</H6>

							<SymbolView name="arrow.up.right" size={10} weight="semibold" tintColor={theme.text.tertiary} />
						</Inner>
					</Pill>

					<Pill isInteractive>
						<Inner onPress={joinTestFlight}>
							<H6 $color={theme.text.secondary} $weight={600}>
								{t('settings.about.beta')}
							</H6>

							<SymbolView name="arrow.up.right" size={10} weight="semibold" tintColor={theme.text.tertiary} />
						</Inner>
					</Pill>

					<Pill isInteractive>
						<Inner onPress={openSite}>
							<H6 $color={theme.text.secondary} $weight={600}>
								{t('settings.about.website')}
							</H6>

							<SymbolView name="arrow.up.right" size={10} weight="semibold" tintColor={theme.text.tertiary} />
						</Inner>
					</Pill>
				</Links>

				<Version onLongPress={() => setLogsVisible(true)}>
					<SmallText $color={theme.text.tertiary}>
						{t('settings.about.version')}&nbsp;{nativeApplicationVersion}&nbsp;({nativeBuildVersion})
					</SmallText>
				</Version>
			</Root>

			<Modal visible={logsVisible} animationType="slide" presentationStyle="fullScreen">
				<LogViewer onClose={() => setLogsVisible(false)} />
			</Modal>
		</>
	);
};

export default Footer;
