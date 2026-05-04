import React from 'react';
import { useTheme } from 'styled-components/native';

import { SmallText, LogoView, Text } from '@ui';
import { SourceBadge } from '../../../components';
import Root, { RowDivider, Info } from './row-result.styles';

import type { Props } from './row-result.d';

const RowResult = ({ onPress, isLast, ...searchResult }: Props) => {
	const theme = useTheme();
	const domain = searchResult.domains?.[0];

	const onPressHd = () => {
		onPress(searchResult);
	};

	return (
		<>
			<Root onPress={onPressHd}>
				<LogoView url={searchResult.logo_url} name={searchResult.name} size={44} />

				<Info>
					<Text $weight={600} numberOfLines={1}>
						{searchResult.name}
					</Text>

					{domain && (
						<SmallText $color={theme.text.tertiary} numberOfLines={1}>
							{domain}
						</SmallText>
					)}
				</Info>

				<SourceBadge source={searchResult.source} />
			</Root>

			{!isLast && <RowDivider />}
		</>
	);
};

export default RowResult;
