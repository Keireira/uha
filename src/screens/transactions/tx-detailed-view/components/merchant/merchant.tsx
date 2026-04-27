import React from 'react';

import { useDateLabel } from './hooks';
import { isAfterToday } from '@lib/date';
import { useTheme } from 'styled-components/native';

import { LogoView } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { Info, Name, DateRow, DateText } from './merchant.styles';

import type { Props } from './merchant.d';

const Merchant = ({ date, slug, logo_url, emoji, customName, title, color }: Props) => {
	const theme = useTheme();
	const dateLabel = useDateLabel(date);
	const isInFuture = isAfterToday(date);

	return (
		<Root>
			<LogoView name={customName || title} url={logo_url} slug={slug} color={color} emoji={emoji} size={56} />

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
