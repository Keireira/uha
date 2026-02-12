import React from 'react';
import * as Haptics from 'expo-haptics';
import { useTheme } from 'styled-components/native';

import { useAppModel } from '@models';

import { SmallText } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { CheckCircle, ImpliedDot, Title, TitleView, Divider } from './filter-entry.styles';

import type { Props } from './filter-entry.d';

const FilterEntry = ({
	id,
	title,
	subtitle,
	activeTab,
	showDivider,
	withSeparator,
	isImplied,
	isSelected,
	isEligible
}: Props) => {
	const theme = useTheme();
	const { lenses } = useAppModel();

	const isDisabled = !isEligible && !isSelected;

	const handleItemPress = () => {
		const filterAction = isSelected ? lenses.filters.remove : lenses.filters.add;

		filterAction({
			type: activeTab,
			value: id
		});

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	return (
		<>
			{showDivider && <Divider $isDimmed={false} />}

			<Root $isDimmed={isDisabled} disabled={isDisabled} onPress={handleItemPress}>
				<CheckCircle $isSelected={isSelected} $isImplied={isImplied}>
					{isSelected && <SymbolView name="checkmark" size={13} weight="bold" tintColor={theme.text.inverse} />}
					{isImplied && <ImpliedDot />}
				</CheckCircle>

				<TitleView>
					<Title $withSubtitle={Boolean(subtitle)}>{title}</Title>

					{subtitle && <SmallText $color={theme.text.secondary}>{subtitle}</SmallText>}
				</TitleView>
			</Root>

			{withSeparator && <Divider $isDimmed={isDisabled} />}
		</>
	);
};

export default FilterEntry;
