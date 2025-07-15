import styled, { css } from 'styled-components/native';
import { Text } from '../../typography';

export const ListSection = styled.View`
	flex: 1;
	margin-bottom: 20px;
`;

export const SectionHeader = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: #6d6d70;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	margin-left: 32px;
	margin-top: 16px;
`;

export const GroupedListContainer = styled.View`
	margin-horizontal: 16px;
	margin-vertical: 8px;
	border-radius: 10px;
	overflow: hidden;
	background-color: white;
`;

const last = css`
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	border-bottom-width: 0;
	border-top-width: 0.5px;
	border-top-color: #c6c6c875;
	border-top-style: solid;
`;

const middle = css`
	border-top-width: 0.5px;
	border-top-color: #c6c6c875;
	border-top-style: solid;
`;

const first = css`
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
`;

export const GroupedListItem = styled.View<{ $isFirst: boolean; $isLast: boolean }>`
	min-height: 44px;
	background-color: white;

	${({ $isFirst }) => $isFirst && first}
	${({ $isFirst, $isLast }) => !$isFirst && !$isLast && middle}
	${({ $isLast }) => $isLast && last}
`;
