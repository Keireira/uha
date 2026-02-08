import React from 'react';

import Root, { IconWrapper, IconText, Title } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, emoji, color, onPress }: PropsT) => {
	return (
		<Root onPress={onPress}>
			<IconWrapper tintColor={color}>
				<IconText>{emoji}</IconText>
			</IconWrapper>

			<Title>{title}</Title>
		</Root>
	);
};

export default React.memo(PreviewItem);
