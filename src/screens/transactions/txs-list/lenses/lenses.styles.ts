import styled, { css } from 'styled-components/native';
import { GlassView, GlassContainer } from 'expo-glass-effect';

const leftSide = css`
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
	padding-right: 6px;
	padding-left: 12px;
	padding-vertical: 6px;
`;

const rightSide = css`
	border-bottom-left-radius: 0;
	border-top-left-radius: 0;
	padding-right: 12px;
	padding-left: 6px;
	padding-vertical: 6px;
`;

const sides = {
	left: leftSide,
	right: rightSide
};

export const GlassItem = styled(GlassView)<{ $side: 'left' | 'right' }>`
	border-radius: 42px;
	padding-vertical: 6px;
	display: flex;
	align-items: center;
	justify-content: center;

	${({ $side }) => sides[$side]}
`;

export const GlassWrapper = styled(GlassContainer)`
	display: flex;
	flex-direction: row;
`;

export const TitlePress = styled.Pressable`
	padding-top: 12px;
	padding-bottom: 12px;
`;

export const FilterBtn = styled.Pressable`
	border-radius: 12px;
	padding: 8px;
`;

export default styled.View`
	display: flex;
	flex-direction: row;
	gap: 16px;
	padding-horizontal: 16px;
	margin-bottom: 16px;
	align-items: center;
	justify-content: space-between;
`;
