import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { withAlpha } from '@lib/colors';

export const FromTimelineBanner = styled.View<{ $accent: string }>`
	flex-direction: row;
	align-items: center;
	gap: 10px;

	padding: 12px 14px;
	margin-bottom: 20px;

	border-radius: 12px;
	background-color: ${({ $accent }) => withAlpha($accent, 0.12)};
`;

export const BannerTextBlock = styled.View`
	flex: 1;
	gap: 2px;
`;

export const BannerTitle = styled.Text<{ $accent: string }>`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 700;

	color: ${({ $accent }) => $accent};
`;

export const BannerDescription = styled.Text`
	font-family: 'Nunito';
	font-size: 12px;
	font-weight: 500;
	line-height: 16px;

	color: ${({ theme }) => theme.text.secondary};
`;

export const Header = styled.View`
	margin-bottom: 12px;
`;

export const Title = styled.Text`
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
	min-width: 120px;
`;

export const ValueInputWrap = styled.View`
	width: 160px;
	align-items: stretch;
	justify-content: center;
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

export const SyncCard = styled(GlassView).attrs({
	isInteractive: true
})`
	overflow: hidden;
	border-radius: 14px;

	margin-top: 20px;
`;

export const SyncPressable = styled.Pressable<{ $accent: string }>`
	flex-direction: row;
	align-items: center;
	gap: 10px;

	padding: 14px 16px;

	background-color: ${({ $accent }) => withAlpha($accent, 0.14)};
`;

export const SyncText = styled.View`
	flex: 1;
`;

export const SyncTitle = styled.Text<{ $accent: string }>`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 700;

	color: ${({ $accent }) => $accent};
`;

export const SyncDescription = styled.Text`
	font-family: 'Nunito';
	font-size: 12px;
	font-weight: 500;
	line-height: 16px;

	color: ${({ theme }) => theme.text.secondary};

	margin-top: 2px;
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

export const Screen = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
`;

export const DoneLabel = styled.Text<{ $accent: string }>`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 700;

	color: ${({ $accent }) => $accent};
`;

export default styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
	keyboardShouldPersistTaps: 'handled',
	keyboardDismissMode: 'on-drag',
	contentContainerStyle: { padding: 20, paddingBottom: 32 }
})`
	background-color: ${({ theme }) => theme.background.secondary};
`;
