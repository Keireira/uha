import styled from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { BaseText } from '@ui';

export const Container = styled.ScrollView.attrs({
	keyboardShouldPersistTaps: 'handled' as const,
	showsVerticalScrollIndicator: false
})`
	flex: 1;
`;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export const Title = styled(BaseText)<{ $dark: boolean }>`
	font-size: 22px;
	font-weight: 700;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;

export const CloseGlass = styled(GlassView)`
	width: 48px;
	height: 48px;
	border-radius: 24px;
	overflow: hidden;
`;

export const CloseInner = styled.Pressable`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

export const Preview = styled.View<{ $bg: string }>`
	align-self: center;
	width: 128px;
	height: 128px;
	align-items: center;
	justify-content: center;
	border-radius: 38px;
	background-color: ${({ $bg }) => $bg};
`;

export const PreviewEmoji = styled(BaseText)`
	font-size: 64px;
`;

export const PreviewPlaceholder = styled(BaseText)<{ $dark: boolean }>`
	font-size: 48px;
	font-weight: 700;
	opacity: 0.3;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;

export const NameInput = styled.TextInput<{ $dark: boolean }>`
	font-family: 'Nunito';
	font-size: 24px;
	font-weight: 700;
	text-align: center;
	padding: 0;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	background-color: transparent;
`;

export const Main = styled.View`
	gap: 36px;
`;

export const Section = styled.View`
	gap: 10px;
`;

export const Caption = styled(BaseText)<{ $dark: boolean }>`
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
	opacity: 0.8;
`;

export const SaveButton = styled.Pressable<{ $disabled: boolean }>`
	height: 52px;
	border-radius: 14px;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.2);
	opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const SaveLabel = styled(BaseText)<{ $dark: boolean }>`
	font-size: 17px;
	font-weight: 700;
	color: ${({ $dark }) => ($dark ? '#333333' : '#ffffff')};
`;
