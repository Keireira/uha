import React from 'react';
import { useTranslation } from 'react-i18next';

import { H4, LogoView } from '@ui';
import { SourceBadge } from '../../components';
import Root, { Label, GlassCard, Inner, Info, Domain } from './top-hit-card.styles';

import type { Props } from './top-hit-card.d';

const TopHitCard = ({ onPress, ...searchResult }: Props) => {
	const { t } = useTranslation();

	const domain = searchResult.domains?.[0];

	const onPressHd = () => {
		onPress(searchResult);
	};

	return (
		<Root>
			<Label>{t('crossroad.search.sections.top_hit')}</Label>

			<GlassCard isInteractive>
				<Inner onPress={onPressHd}>
					<LogoView url={searchResult.logo_url} name={searchResult.name} size={56} />

					<Info>
						<H4 numberOfLines={1}>{searchResult.name}</H4>

						{domain && <Domain numberOfLines={1}>{domain}</Domain>}
					</Info>

					<SourceBadge source={searchResult.source} />
				</Inner>
			</GlassCard>
		</Root>
	);
};

export default TopHitCard;
