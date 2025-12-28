import styled from 'styled-components/native';
import { H2 } from '@ui';
import { Host } from '@expo/ui/swift-ui';

export const SheetHost = styled(Host)`
	position: absolute;
	min-height: 400px;
`;

export const SheetContent = styled.View`
	padding: 18px;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 16px;
	min-height: 100px;
`;

export const Title = styled(H2)``;

export const TitlePress = styled.Pressable`
	padding-top: 12px;
	padding-bottom: 12px;
`;

export const FilterBtn = styled.Pressable`
	border-radius: 12px;
	padding: 12px;
`;

export default styled.View`
	display: flex;
	flex-direction: row;
	gap: 16px;
	margin-top: 32px;
	padding-horizontal: 16px;
	align-items: center;
	justify-content: space-between;
`;
