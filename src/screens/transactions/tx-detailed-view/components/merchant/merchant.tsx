import React from 'react';

import { useDateLabel } from './hooks';
import { isAfterToday } from '@lib/date';
import { useTheme } from 'styled-components/native';

import { LogoView } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Info, Name, DateRow, DateText } from './merchant.styles';

import type { Props } from './merchant.d';

const Merchant = ({ date, slug, logo_url, custom_logo, custom_symbol, emoji, customName, title, color }: Props) => {
	const theme = useTheme();
	const dateLabel = useDateLabel(date);
	const isInFuture = isAfterToday(date);
	const hasCustomLogo = Boolean(custom_logo || custom_symbol);
	const customSymbol = (custom_symbol ?? undefined) as React.ComponentProps<typeof LogoView>['symbolName'];

	return (
		<Root>
			<LogoView
				name={customName || title}
				url={custom_logo ?? logo_url}
				slug={hasCustomLogo ? null : slug}
				symbolName={customSymbol}
				color={color}
				emoji={emoji}
				size={56}
			/>

			<Info>
				<Name numberOfLines={1} ellipsizeMode="tail">
					{customName || title}
				</Name>

				<DateRow>
					{isInFuture && <SymbolView name="clock" tintColor={theme.accents.orange} size={14} />}

					<DateText numberOfLines={1} ellipsizeMode="tail">
						{dateLabel}
					</DateText>
				</DateRow>
			</Info>
		</Root>
	);
};

export default Merchant;
