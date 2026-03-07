import styled from 'styled-components/native';
import { SmallText } from '@ui';

export const SectionHeaderText = styled(SmallText)`
	font-weight: 600;
	color: ${({ theme }) => theme.text.secondary};
	text-transform: uppercase;
	letter-spacing: 0.5px;
	padding: 16px 6px 6px;
`;

export const VerticalSpacer = styled.View<{ $height: number }>`
	height: ${({ $height }) => $height}px;
`;

export const Content = styled.View`
	flex: 1;
	flex-direction: column;
	padding-horizontal: 24px;
`;

export default styled.View.attrs({ collapsable: false })`
	flex: 1;
`;
