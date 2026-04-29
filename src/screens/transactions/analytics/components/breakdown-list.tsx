import React from 'react';
import { useTranslation } from 'react-i18next';

import { LogoView } from '@ui';
import {
	BreakdownSection,
	BreakdownSectionTitle,
	BreakdownItem,
	CategoryBadge,
	CategoryEmoji,
	BreakdownTextGroup,
	BreakdownTitle,
	BreakdownSubtitle,
	BreakdownAmount
} from '../analytics-sheet.styles';

import type { BreakdownSectionT } from '../analytics.d';

type Props = {
	sections: BreakdownSectionT[];
	onPressCategory: (id: string) => void;
};

const BreakdownList = ({ sections, onPressCategory }: Props) => {
	const { t } = useTranslation();

	return (
		<BreakdownSection>
			{sections.map((section, sectionIndex) => (
				<React.Fragment key={section.id}>
					{section.title && (
						<BreakdownSectionTitle $withTopMargin={sectionIndex > 0}>{section.title}</BreakdownSectionTitle>
					)}

					{section.rows.map((row) => {
						if (row.type === 'category') {
							return (
								<BreakdownItem key={row.id} onPress={() => onPressCategory(row.id)}>
									<CategoryBadge $color={row.color}>
										<CategoryEmoji>{row.emoji}</CategoryEmoji>
									</CategoryBadge>

									<BreakdownTextGroup>
										<BreakdownTitle numberOfLines={1} ellipsizeMode="tail">
											{row.title}
										</BreakdownTitle>
										<BreakdownSubtitle numberOfLines={1} ellipsizeMode="tail">
											{row.subtitle}
										</BreakdownSubtitle>
									</BreakdownTextGroup>

									<BreakdownAmount numberOfLines={1} ellipsizeMode="tail">
										{row.formattedAmount}
									</BreakdownAmount>
								</BreakdownItem>
							);
						}

						const hasCustomLogo = Boolean(row.tx.custom_logo || row.tx.custom_symbol);
						const customSymbol = (row.tx.custom_symbol ?? undefined) as React.ComponentProps<
							typeof LogoView
						>['symbolName'];
						const logoUrl = row.tx.custom_logo ?? (row.tx.custom_symbol ? undefined : row.tx.logo_url);

						return (
							<BreakdownItem key={row.id}>
								<LogoView
									url={logoUrl}
									slug={hasCustomLogo ? null : row.tx.slug}
									symbolName={customSymbol}
									emoji={row.tx.emoji}
									name={row.title}
									size={46}
									color={row.tx.color}
								/>

								<BreakdownTextGroup>
									<BreakdownTitle numberOfLines={1} ellipsizeMode="tail">
										{row.title}
									</BreakdownTitle>
									<BreakdownSubtitle numberOfLines={1} ellipsizeMode="tail">
										{row.subtitle || t(`category.${row.tx.category_slug}`)}
									</BreakdownSubtitle>
								</BreakdownTextGroup>

								<BreakdownAmount numberOfLines={1} ellipsizeMode="tail">
									{row.formattedAmount}
								</BreakdownAmount>
							</BreakdownItem>
						);
					})}
				</React.Fragment>
			))}
		</BreakdownSection>
	);
};

export default BreakdownList;
