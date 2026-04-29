import React, { useCallback } from 'react';

import { LogoView } from '@ui';
import Root, { LogoGlass, Title } from './preview-item.styles';

import type { PropsT } from './preview-item.d';

const PreviewItem = ({ id, title, logo_url, slug, symbol, color = '#333333', onPress }: PropsT) => {
	const handlePress = useCallback(() => {
		onPress?.(id);
	}, [id, onPress]);

	return (
		<Root onPress={handlePress}>
			<LogoGlass>
				<LogoView
					name={title}
					url={symbol ? undefined : logo_url}
					slug={symbol ? null : slug}
					symbolName={symbol as React.ComponentProps<typeof LogoView>['symbolName']}
					color={color}
					size={44}
				/>
			</LogoGlass>

			<Title>{title}</Title>
		</Root>
	);
};

export default React.memo(PreviewItem);
