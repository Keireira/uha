import React from 'react';

import logos from '@assets/logos';
import { useDateLabel } from './hooks';
import { useTheme } from 'styled-components/native';

import { LogoView } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Info, Name, DateRow, DateText } from './merchant.styles';

import type { Props } from './merchant.d';

const Merchant = ({ date, slug, emoji, customName, title, color, isPhantom }: Props) => {
	const theme = useTheme();
	const dateLabel = useDateLabel(date);
	const logoUrl = slug ? logos[slug as keyof typeof logos] : null;

	return (
		<Root>
			<LogoView logoId={logoUrl} emoji={emoji} name={customName || title} size={56} color={color} />

			<Info>
				<Name numberOfLines={1} ellipsizeMode="tail">
					{customName || title}
				</Name>

				<DateRow>
					{isPhantom && <SymbolView name="clock" tintColor={theme.accent.primary} size={14} />}

					<DateText numberOfLines={1} ellipsizeMode="tail">
						{dateLabel}
					</DateText>
				</DateRow>
			</Info>
		</Root>
	);
};

export default Merchant;
