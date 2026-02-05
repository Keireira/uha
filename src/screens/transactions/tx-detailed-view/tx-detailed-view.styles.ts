import styled from 'styled-components/native';
import { Host } from '@expo/ui/swift-ui';
import { Text } from '@ui';

export const TenderComment = styled(Text)`
	color: ${({ theme }) => theme.text.secondary};
`;

export const TenderTitle = styled(Text)`
	font-weight: 700;
`;

export const TenderInfo = styled.View`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const TenderLogo = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 20%;
	min-width: 75px;
	aspect-ratio: 1.586 / 1;
	border-radius: 8px;
	background-color: ${({ theme }) => theme.background.default};
`;

export const TenderWrap = styled.View`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	border-radius: 8px;
	gap: 12px;
	margin-top: 24px;
`;

export const SectionItem = styled.View<{ $backgroundColor?: string }>`
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	gap: 4px;
	flex: 1;
`;

export const Section = styled.View`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: flex-start;
	gap: 18px;
	width: 100%;
	margin-top: 24px;
`;

/* Prices section styles */
export const Prices = styled.View`
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
	margin-bottom: 24px;
	margin-top: 36px;
`;

/* Divider section styles */
export const DividerHost = styled(Host)``;

/* Tags section styles */
export const Tag = styled.View<{ $color?: string }>`
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 6px;
	padding: 4px 8px;
	border-radius: 6px;
	background-color: ${({ $color, theme }) => ($color ? `${$color}33` : theme.accent.secondary)};
`;

export const Tags = styled.ScrollView.attrs({
	horizontal: true,
	scrollEnabled: true,
	showsHorizontalScrollIndicator: false,
	contentContainerStyle: {
		gap: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	}
})`
	padding-vertical: 12px;
`;

/* Header section styles */
export const Title = styled.View`
	gap: 6px;
	flex-direction: row;
	align-items: center;
`;

export const HeadDetails = styled.View`
	gap: 8px;
	align-items: flex-start;
	justify-content: center;
`;

export const Header = styled.View`
	flex-direction: row;
	gap: 18px;
`;

export default styled.ScrollView.attrs({
	contentContainerStyle: {
		paddingHorizontal: 18,
		paddingTop: 18,
		gap: 12
	}
})`
	flex: 1;
	padding-bottom: 36px;
`;
