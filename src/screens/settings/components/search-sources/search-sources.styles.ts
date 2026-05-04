import styled from 'styled-components/native';
import { SmallText, H5 } from '@ui';

export const ProviderRow = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 14px 16px;
	gap: 12px;
`;

export const ProviderInfo = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	gap: 10px;
`;

export const Dot = styled.View<{ $color: string }>`
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: ${({ $color }) => $color};
`;

export const ProviderName = styled(H5)`
	font-weight: 600;
`;

export const Separator = styled.View`
	height: 1px;
	margin-horizontal: 16px;
	background-color: ${({ theme }) => `${theme.border.default}25`};
`;

export const StoreConfigRow = styled.View`
	flex-direction: row;
	padding: 0 16px 14px 36px;
	gap: 10px;
`;

export const DescText = styled(SmallText)`
	font-size: 13px;
	color: ${({ theme }) => theme.text.secondary};
`;

export const DescRow = styled.View`
	padding: 0 16px 14px 36px;
	gap: 10px;
`;

export const ConfigPill = styled.Pressable<{ $color: string }>`
	flex-direction: row;
	align-items: center;
	padding: 5px 10px;
	border-radius: 8px;
	background-color: ${({ $color }) => `${$color}10`};
	gap: 5px;
`;

export const ConfigPillText = styled(SmallText)<{ $color: string }>`
	font-weight: 500;
	color: ${({ $color }) => $color};
`;

export default styled.View`
	padding-vertical: 4px;
`;
