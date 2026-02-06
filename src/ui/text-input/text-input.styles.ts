import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const SearchInput = styled(TextInput)`
	flex: 1;
	font-family: 'Nunito';
	font-size: 15px;
	color: ${({ theme }) => theme.text.primary};
	padding: 12px;
`;

export default styled.View<{ $withLeadingIcon: boolean; $withClear: boolean }>`
	flex: 1;
	background-color: ${({ theme }) => theme.background.secondary};
	border-radius: 14px;
	padding-left: ${({ $withLeadingIcon }) => ($withLeadingIcon ? '14px' : '0')};
	padding-right: ${({ $withClear }) => ($withClear ? '14px' : '0')};
	flex-direction: row;
	align-items: center;
	gap: 8px;
`;
