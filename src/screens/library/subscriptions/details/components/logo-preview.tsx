import React from 'react';

import { LogoView } from '@ui';
import { frame } from '@expo/ui/swift-ui/modifiers';
import { HStack, RNHostView } from '@expo/ui/swift-ui';

import type { SFSymbol } from 'expo-symbols';
import type { LogoDraftT } from '@screens/crossroad/add-subscription/events';

type Props = {
	logo: LogoDraftT;
	title: string;
};

const LogoPreview = ({ logo, title }: Props) => (
	<HStack alignment="center" modifiers={[frame({ maxWidth: Number.POSITIVE_INFINITY })]}>
		<RNHostView matchContents>
			<LogoView
				name={title}
				symbolName={(logo.symbol ?? null) as SFSymbol | null}
				url={logo.image_uri ?? null}
				color={logo.color ?? null}
				size={96}
			/>
		</RNHostView>
	</HStack>
);

export default LogoPreview;
