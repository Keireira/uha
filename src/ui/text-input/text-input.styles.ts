import styled from 'styled-components/native';
import { TextInput } from 'react-native';

export const SearchInput = styled(TextInput)`
	flex: 1;
	font-family: 'Nunito';
	font-size: 18px;
	color: #333;
	padding: 20px 12px;
`;

export default styled.View<{ $withLeadingIcon: boolean; $withClear: boolean }>`
	flex: 1;
	border: 1px solid #e0e0e0;
	background-color: #f7f7f8;
	border-radius: 10px;
	padding-left: ${({ $withLeadingIcon }) => ($withLeadingIcon ? '16px' : '0')};
	padding-right: ${({ $withClear }) => ($withClear ? '16px' : '0')};
	flex-direction: row;
	align-items: center;
	gap: 8px;
`;
