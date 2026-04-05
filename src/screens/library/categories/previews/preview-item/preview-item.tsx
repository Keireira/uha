import React, { useCallback } from 'react';

import { LogoView } from '@ui';
import Root, { IconWrapper, Title } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ slug, title, emoji, color, onPress }: PropsT) => {
	const handlePress = useCallback(() => {
		onPress?.(slug);
	}, [slug, onPress]);

	return (
		<Root onPress={handlePress}>
			<IconWrapper>
				<LogoView name={title} emoji={emoji} color={color} size={44} />
			</IconWrapper>

			<Title>{title}</Title>
		</Root>
	);
};

export default React.memo(PreviewItem);
