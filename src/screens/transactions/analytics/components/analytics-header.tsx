import React from 'react';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTheme } from 'styled-components/native';

import { Header, CloseGlass, CloseInner, Title } from '../analytics-sheet.styles';

type Props = {
	title: string;
	isNested: boolean;
	onBack: () => void;
};

const AnalyticsHeader = ({ title, isNested, onBack }: Props) => {
	const router = useRouter();
	const theme = useTheme();

	return (
		<Header>
			<CloseGlass isInteractive>
				<CloseInner onPress={isNested ? onBack : () => router.back()} hitSlop={10}>
					<SymbolView
						name={isNested ? 'chevron.left' : 'xmark'}
						size={16}
						weight="bold"
						tintColor={theme.text.primary}
					/>
				</CloseInner>
			</CloseGlass>

			<Title numberOfLines={1} ellipsizeMode="tail">
				{title}
			</Title>

			<CloseGlass style={{ opacity: 0 }} />
		</Header>
	);
};

export default AnalyticsHeader;
