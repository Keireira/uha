import React from 'react';
import { head } from 'ramda';

import { SmallText } from '@ui';
import logos from '@assets/logos';
import LogoView from '@ui/logo-view';
import Root, { DayNumber, LogoContainer, OverflowBadge } from './day.styles';

import type { Props } from './day.d';

const Day = ({ content, txs }: Props) => {
	const withTxs = txs.length > 0;

	const indexTx = head(txs);
	const indexTxLogoUrl = indexTx?.slug ? logos[indexTx.slug as keyof typeof logos] : null;

	return (
		<Root $isEmpty={!content} $woTxs={!withTxs}>
			{txs.length > 0 && indexTx && (
				<LogoContainer>
					<LogoView
						logoId={indexTxLogoUrl}
						color={indexTx.color}
						name={indexTx.customName || indexTx.title}
						size={22}
					/>
				</LogoContainer>
			)}

			{txs.length > 1 && (
				<OverflowBadge>
					<SmallText $color="#FFFFFF">+{txs.length - 1}</SmallText>
				</OverflowBadge>
			)}

			{content && <DayNumber $withTxs={withTxs}>{content}</DayNumber>}
		</Root>
	);
};

export default React.memo(Day);
