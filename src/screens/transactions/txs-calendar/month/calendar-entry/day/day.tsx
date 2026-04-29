import React from 'react';
import { head } from 'ramda';
import * as Haptics from 'expo-haptics';

import LogoView from '@ui/logo-view';
import Root, { DayNumber, LogoContainer, OverflowText, OverflowBadge, EmptyLogo } from './day.styles';

import type { Props } from './day.d';

const Day = ({ content, raw, txs, isSelected, iconSize, setSelectedDay }: Props) => {
	const indexTx = head(txs);
	const hasCustomLogo = Boolean(indexTx?.custom_logo || indexTx?.custom_symbol);
	const customSymbol = (indexTx?.custom_symbol ?? undefined) as React.ComponentProps<typeof LogoView>['symbolName'];
	const logoUrl = indexTx?.custom_logo ?? (indexTx?.custom_symbol ? undefined : indexTx?.logo_url);

	const onPressHd = () => {
		if (isSelected || !content) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setSelectedDay(raw);
	};

	return (
		<Root $isEmpty={!content} onPress={onPressHd} $isSelected={isSelected}>
			<LogoContainer>
				{txs.length > 0 && indexTx && (
					<LogoView
						url={logoUrl}
						slug={hasCustomLogo ? null : indexTx.slug}
						symbolName={customSymbol}
						color={indexTx.color}
						name={indexTx.customName || indexTx.title}
						size={iconSize}
					>
						{txs.length > 1 && (
							<OverflowBadge>
								<OverflowText>+{txs.length - 1}</OverflowText>
							</OverflowBadge>
						)}
					</LogoView>
				)}

				{!txs.length && content && <EmptyLogo />}
			</LogoContainer>

			{content && <DayNumber $isSelected={isSelected}>{content}</DayNumber>}
		</Root>
	);
};

export default React.memo(Day);
