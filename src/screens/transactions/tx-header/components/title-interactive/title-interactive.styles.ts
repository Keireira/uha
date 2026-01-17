import styled from 'styled-components/native';
import { Host } from '@expo/ui/swift-ui';
import { H2 } from '@ui';

/* Bottom Sheet */
export const Pickers = styled.View`
	display: flex;
	flex-direction: row;
`;

export const ButtonsRow = styled.View`
	flex-direction: row;
	padding-top: 4px;
`;

export const InnerBottomSheet = styled.View`
	display: flex;
	flex-direction: column;
`;

export const SheetHost = styled(Host)`
	position: absolute;
`;

/* Trigger */
export const Title = styled(H2)`
	text-transform: capitalize;
	color: ${({ theme }) => theme.text.primary};
`;

export default styled.Pressable`
	padding-top: 12px;
	padding-bottom: 12px;
`;
