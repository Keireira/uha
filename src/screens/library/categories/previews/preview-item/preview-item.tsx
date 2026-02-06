import React from 'react';

import Root, { IconWrapper, IconText, Title } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, emoji, color }: PropsT) => {
	return (
		<Root>
			<IconWrapper tintColor={color}>
				<IconText>{emoji}</IconText>
			</IconWrapper>

			<Title>{title}</Title>
		</Root>
	);
};

export default React.memo(PreviewItem);
