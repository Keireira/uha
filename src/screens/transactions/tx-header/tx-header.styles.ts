import styled, { css } from 'styled-components/native';
import { GlassView, GlassContainer } from 'expo-glass-effect';

const leftSide = css`
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
`;

const rightSide = css`
	border-bottom-left-radius: 0;
	border-top-left-radius: 0;
`;

const sides = {
	left: leftSide,
	right: rightSide
};

export const GlassItem = styled(GlassView)<{ $side: 'left' | 'right' }>`
	border-radius: 42px;
	display: flex;
	align-items: center;
	justify-content: center;

	${({ $side }) => sides[$side]}
`;

export const GlassWrapper = styled(GlassContainer)`
	display: flex;
	flex-direction: row;
`;

export const FilterBtn = styled.Pressable`
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	padding-vertical: 8px;
`;

export default styled.View`
	display: flex;
	flex-direction: row;
	gap: 16px;
	margin-bottom: 16px;
	align-items: center;
	padding-horizontal: 16px;
	justify-content: space-between;
`;
