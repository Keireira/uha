import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

export const Section = styled.View`
	margin-bottom: 20px;
`;

export const SectionHeader = styled.View`
	margin-bottom: 10px;
`;

export const SectionTitle = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.4px;

	color: ${({ theme }) => theme.text.tertiary};

	padding-horizontal: 4px;
`;

export const SectionHint = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 400;

	color: ${({ theme }) => theme.text.tertiary};

	padding-horizontal: 4px;
	margin-top: 8px;
`;

export const Card = styled(GlassView).attrs({
	isInteractive: false
})`
	overflow: hidden;
	border-radius: 14px;
`;

export const ToggleRow = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	padding: 14px 16px;
`;

export const ToggleLabel = styled.Text`
	font-family: 'Nunito';
	font-size: 16px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.primary};
`;

export const DaysList = styled.View``;

export const DayRow = styled.Pressable<{ $isLast: boolean }>`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	padding: 14px 16px;

	border-bottom-width: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
	border-bottom-color: ${({ theme }) => withAlpha(theme.text.tertiary, 0.18)};
`;

export const DayLabel = styled.Text`
	font-family: 'Nunito';
	font-size: 16px;
	font-weight: 500;

	color: ${({ theme }) => theme.text.primary};
`;

export const DayCheck = styled.View<{ $active: boolean; $accent: string }>`
	width: 24px;
	height: 24px;
	border-radius: 12px;

	align-items: center;
	justify-content: center;

	background-color: ${({ $active, $accent, theme }) =>
		$active ? $accent : withAlpha(theme.text.tertiary, 0.2)};
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	contentContainerStyle: { padding: 20, paddingBottom: 32 }
})`
	background-color: ${({ theme }) => theme.background.secondary};
`;
