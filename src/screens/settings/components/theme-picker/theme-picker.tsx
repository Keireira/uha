import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';

import { useAccent } from '@hooks';
import { AUTO_MODE, MODES } from './data';
import { useGetModifiers, useGetActiveMode } from './hooks';

import { HStack, VStack, Image, Text } from '@expo/ui/swift-ui';
import { font, frame, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

const ThemePicker = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const settingAccent = useAccent();

	const activeMode = useGetActiveMode();
	const getModifiers = useGetModifiers();

	const isAutoActive = activeMode === AUTO_MODE.mode;

	return (
		<VStack spacing={12} modifiers={[frame({ maxWidth: Number.POSITIVE_INFINITY })]}>
			<HStack spacing={12} modifiers={[frame({ maxWidth: Number.POSITIVE_INFINITY })]}>
				{MODES.map((mode) => {
					const isActive = activeMode === mode.mode;

					return (
						<VStack key={mode.mode} spacing={12} modifiers={getModifiers(mode, isActive)}>
							<Image systemName={mode.icon} size={28} color={isActive ? settingAccent : mode.text} />

							<Text
								modifiers={[
									font({ design: 'rounded', weight: 'semibold', size: 14 }),
									foregroundStyle(mode?.text || theme.text.primary)
								]}
							>
								{t(mode.labelKey)}
							</Text>
						</VStack>
					);
				})}
			</HStack>

			<HStack spacing={8} modifiers={getModifiers(AUTO_MODE, isAutoActive)}>
				<Image systemName={AUTO_MODE.icon} size={20} color={isAutoActive ? settingAccent : AUTO_MODE.text} />

				<Text
					modifiers={[
						font({ design: 'rounded', weight: 'semibold', size: 14 }),
						foregroundStyle(AUTO_MODE?.text || theme.text.primary)
					]}
				>
					{t(AUTO_MODE.labelKey)}
				</Text>
			</HStack>
		</VStack>
	);
};

export default ThemePicker;
