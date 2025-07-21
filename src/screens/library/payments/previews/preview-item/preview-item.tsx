import React from 'react';

import Root, { Title, Gradient, IconWrapper, IconText, Top, Bottom, Comment } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, emoji, comment, color = '#333333' }: PropsT) => {
	return (
		<Root $color={color}>
			<Gradient colors={[`${color}40`, `${color}60`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

			<Top>
				<IconWrapper>
					<IconText>{emoji}</IconText>
				</IconWrapper>

				<Title>{title}</Title>
			</Top>

			{comment && (
				<Bottom>
					<Comment>{comment}</Comment>
				</Bottom>
			)}
		</Root>
	);
};

export default React.memo(PreviewItem);
