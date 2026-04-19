import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

export const Header = styled.View`
	margin-bottom: 12px;
`;

export const Title = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.4px;

	color: ${({ theme }) => theme.text.tertiary};

	padding-horizontal: 4px;
`;

export const Presets = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	gap: 8px;

	margin-bottom: 28px;
`;

export const PresetChip = styled(GlassView).attrs({
	isInteractive: true
})`
	overflow: hidden;
	border-radius: 999px;
`;

export const PresetPressable = styled.Pressable<{ $active: boolean; $accent: string }>`
	padding: 10px 14px;

	background-color: ${({ $active, $accent }) => ($active ? withAlpha($accent, 0.22) : 'transparent')};
`;

export const PresetLabel = styled.Text<{ $active: boolean; $accent: string }>`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 600;

	color: ${({ theme, $active, $accent }) => ($active ? $accent : theme.text.primary)};
`;

export const ValueBlock = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 24px;

	margin-bottom: 24px;
`;

export const StepperButton = styled(GlassView).attrs({
	isInteractive: true
})`
	width: 52px;
	height: 52px;
	overflow: hidden;
	border-radius: 999px;
`;

export const StepperPressable = styled.Pressable<{ $disabled?: boolean }>`
	flex: 1;
	align-items: center;
	justify-content: center;

	opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const ValueDisplay = styled.View`
	align-items: center;
	min-width: 140px;
`;

export const ValueNumber = styled.Text`
	font-family: 'Nunito';
	font-size: 52px;
	font-weight: 700;
	line-height: 60px;

	color: ${({ theme }) => theme.text.primary};
`;

export const ValueUnit = styled.Text`
	font-family: 'Nunito';
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.6px;

	color: ${({ theme }) => theme.text.tertiary};

	margin-top: 2px;
`;

export const UnitRow = styled.View`
	flex-direction: row;
	gap: 8px;
`;

export const UnitChipWrap = styled(GlassView).attrs({
	isInteractive: true
})`
	flex: 1;
	overflow: hidden;
	border-radius: 12px;
`;

export const UnitChip = styled.Pressable<{ $active: boolean; $accent: string }>`
	padding: 12px 0;

	align-items: center;
	justify-content: center;

	background-color: ${({ $active, $accent }) => ($active ? withAlpha($accent, 0.22) : 'transparent')};
`;

export const UnitLabel = styled.Text<{ $active: boolean; $accent: string }>`
	font-family: 'Nunito';
	font-size: 14px;
	font-weight: 600;
	text-transform: capitalize;

	color: ${({ theme, $active, $accent }) => ($active ? $accent : theme.text.primary)};
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	contentContainerStyle: { padding: 20, paddingBottom: 32 }
})`
	background-color: ${({ theme }) => theme.background.secondary};
`;
