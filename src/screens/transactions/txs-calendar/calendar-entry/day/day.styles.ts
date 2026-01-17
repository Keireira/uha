import styled from 'styled-components/native';
import { LargeText, SmallText } from '@ui';

export const EmptyLogo = styled.View`
	width: 32px;
	height: 32px;
	background-color: ${({ theme }) => `${theme.surface.secondary}40`};
	border-radius: 12px;
`;

export const DayNumber = styled(LargeText).attrs({
	$weight: 600,
	$align: 'center'
})<{ $isSelected: boolean }>`
	color: ${({ $isSelected, theme }) => ($isSelected ? theme.text.inverse : theme.text.primary)};
`;

export const LogoContainer = styled.View`
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;

export const OverflowText = styled(SmallText).attrs({
	$bold: true,
	numberOfLines: 1,
	ellipsizeMode: 'clip'
})`
	color: ${({ theme }) => theme.static.white};
	transform: rotate(-45deg);
`;

export const OverflowBadge = styled.View`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 60%;
	height: 110%;
	background-color: ${({ theme }) => theme.accent.secondary};
	display: flex;
	align-items: flex-start;
	justify-content: center;
	transform: rotate(45deg) translateY(4px);
	transform-origin: center;
`;

export default styled.Pressable<{ $isEmpty: boolean; $isSelected: boolean }>`
	flex: 1;
	aspect-ratio: 1 / 1.5;
	margin: 2px;
	border-radius: 12px;
	background-color: ${({ $isEmpty, $isSelected, theme }) => {
		if ($isEmpty) return `${theme.surface.default}30`;

		return $isSelected ? theme.accent.primary : theme.surface.default;
	}};
	padding: 6px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 4px;
`;
