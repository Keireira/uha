import React from 'react';
import { useTheme } from 'styled-components/native';

import { SmallText, LogoView, Text } from '@ui';
import { SourceBadge } from '../../../components';
import Root, { RowDivider, Info } from './row-result.styles';

import type { Props } from './row-result.d';

const RowResult = ({ id, logo_url, name, domains, source, onPress, isLast }: Props) => {
	const theme = useTheme();
	const domain = domains?.[0];

	const onPressHd = () => {
		onPress({ id, logo_url, name, domains, source });
	};

	return (
		<>
			<Root onPress={onPressHd}>
				<LogoView url={logo_url} name={name} size={44} />

				<Info>
					<Text $weight={600} numberOfLines={1}>
						{name}
					</Text>

					{domain && (
						<SmallText $color={theme.text.tertiary} numberOfLines={1}>
							{domain}
						</SmallText>
					)}
				</Info>

				<SourceBadge source={source} />
			</Root>

			{!isLast && <RowDivider />}
		</>
	);
};

export default RowResult;
