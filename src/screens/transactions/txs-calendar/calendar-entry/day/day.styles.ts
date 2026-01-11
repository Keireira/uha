import styled, { css } from 'styled-components/native';
import { LargeText } from '@ui';

const tmp = css`
	position: absolute;
	bottom: 6px;
	left: 0;
	right: 0;
	font-size: 14px;
`;

export const DayNumber = styled(LargeText)<{ $withTxs: boolean }>`
	${({ $withTxs }) => $withTxs && tmp}
	text-align: center;
	color: #fafafa;
	font-weight: 600;
`;

export const LogoContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

export const OverflowBadge = styled.View`
	position: absolute;
	top: 4px;
	right: 4px;
	background-color: #48484a;
	border-radius: 8px;
	padding: 2px 6px;
`;

const test = css`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const test2 = css`
	position: relative;
`;

export default styled.View<{ $isEmpty: boolean; $woTxs: boolean }>`
	flex: 1;
	aspect-ratio: 1;
	margin: 2px;
	border-radius: 12px;
	background-color: ${({ $isEmpty }) => ($isEmpty ? 'rgba(52, 52, 52, 0.2)' : '#2c2c2e')};
	padding: 6px;
	${({ $woTxs }) => ($woTxs ? test : test2)}
`;
