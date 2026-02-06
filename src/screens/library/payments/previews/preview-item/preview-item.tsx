import React from 'react';

import Root, { Title, IconWrapper, IconText, Top, Bottom, Comment } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ title, emoji, comment, color = '#333333' }: PropsT) => {
	return (
		<Root tintColor={color}>
			<Top>
				<IconWrapper tintColor={color}>
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
