import React from 'react';

import { H4, LogoView } from '@ui';
import { SourceBadge } from '../../components';
import Root, { Label, GlassCard, Inner, Info, Domain } from './top-hit-card.styles';

import type { Props } from './top-hit-card.d';

const TopHitCard = ({ id, logo_url, name, domains, source, onPress }: Props) => {
	const domain = domains?.[0];

	const onPressHd = () => {
		onPress({ id, logo_url, name, domains, source });
	};

	return (
		<Root>
			<Label>Top Hit</Label>

			<GlassCard isInteractive>
				<Inner onPress={onPressHd}>
					<LogoView url={logo_url} name={name} size={56} />

					<Info>
						<H4 numberOfLines={1}>{name}</H4>

						{domain && <Domain numberOfLines={1}>{domain}</Domain>}
					</Info>

					<SourceBadge source={source} />
				</Inner>
			</GlassCard>
		</Root>
	);
};

export default TopHitCard;
