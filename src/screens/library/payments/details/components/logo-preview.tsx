import React from 'react';

import { LogoView } from '@ui';
import { frame } from '@expo/ui/swift-ui/modifiers';
import { HStack, RNHostView } from '@expo/ui/swift-ui';

import type { PaymentEditParams } from '@screens/library/payments';

const LogoPreview = ({ title, symbol, emoji, logo_url, color }: PaymentEditParams) => (
	<HStack alignment="center" modifiers={[frame({ maxWidth: Number.POSITIVE_INFINITY })]}>
		<RNHostView matchContents>
			<LogoView name={title} symbolName={symbol} emoji={emoji} url={logo_url} color={color} size={96} />
		</RNHostView>
	</HStack>
);

export default LogoPreview;
