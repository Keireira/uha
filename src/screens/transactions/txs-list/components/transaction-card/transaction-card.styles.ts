import styled from 'styled-components/native';
import { Text } from '@ui';

export const BottomText = styled(Text)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const LogoSection = styled.View`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const DescSection = styled.View`
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
`;

export const PriceSection = styled.View<{ $isSingle: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: ${({ $isSingle }) => ($isSingle ? 'center' : 'flex-end')};
	gap: 4px;
`;

export const LogoWrap = styled.View`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const TextWrap = styled.View`
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	gap: 4px;
`;

export const TextRow = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

export default styled.Pressable`
	display: flex;
	flex-direction: row;

	gap: 16px;
	padding: 12px 16px;
	border-radius: 16px;
`;
