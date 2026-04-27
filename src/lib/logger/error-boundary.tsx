import React from 'react';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import logger from './logger';

import type { ErrorInfo, ReactNode } from 'react';
type Props = { children: ReactNode };
type State = { error: Error | null };

const Container = styled.View<{ $pt: number; $pb: number }>`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
	padding-horizontal: 16px;
	padding-top: ${({ $pt }) => $pt}px;
	padding-bottom: ${({ $pb }) => $pb}px;
`;

const Title = styled.Text`
	font-size: 22px;
	font-weight: 700;
	color: ${({ theme }) => theme.semantic.error};
	margin-bottom: 8px;
`;

const ErrorName = styled.Text`
	font-size: 15px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
	margin-bottom: 12px;
`;

const Scroll = styled.ScrollView`
	flex: 1;
	background-color: ${({ theme }) => theme.surface.secondary};
	border-radius: 12px;
	margin-bottom: 16px;
`;

const Stack = styled.Text`
	font-size: 12px;
	color: ${({ theme }) => theme.text.secondary};
	line-height: 18px;
`;

const Button = styled.Pressable`
	background-color: ${({ theme }) => theme.surface.default};
	border-radius: 12px;
	padding-vertical: 14px;
	align-items: center;
`;

const ButtonText = styled.Text`
	font-size: 16px;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
`;

const ErrorScreen = ({ error, onReset }: { error: Error; onReset: () => void }) => {
	const insets = useSafeAreaInsets();

	return (
		<Container $pt={insets.top + 16} $pb={insets.bottom + 16}>
			<Title>App Crash</Title>
			<ErrorName>
				{error.name}: {error.message}
			</ErrorName>

			<Scroll contentContainerStyle={{ padding: 12 }}>
				<Stack selectable>{error.stack ?? 'No stack trace'}</Stack>
			</Scroll>

			<Button onPress={onReset}>
				<ButtonText>Try Again</ButtonText>
			</Button>
		</Container>
	);
};

class ErrorBoundary extends React.Component<Props, State> {
	state: State = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		logger.error('[ErrorBoundary]', error.message, error.stack ?? '', info.componentStack ?? '');
	}

	handleReset = () => {
		this.setState({ error: null });
	};

	render() {
		if (this.state.error) {
			return <ErrorScreen error={this.state.error} onReset={this.handleReset} />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
