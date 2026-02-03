import styled from 'styled-components/native';

export const Tag = styled.View<{ $color?: string }>`
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 6px;
	padding: 4px 8px;
	border-radius: 6px;
	background-color: ${({ $color, theme }) => ($color ? `${$color}33` : theme.accent.secondary)};
`;

export const Tags = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 12px;
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
`;

export const Title = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 6px;
`;

export const HeadDetails = styled.View`
	flex: 1;
	justify-content: center;
	align-items: flex-start;
	gap: 4px;
`;

export const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 18px;
`;

export default styled.ScrollView.attrs({
	contentContainerStyle: {
		paddingHorizontal: 18,
		paddingTop: 18,
		gap: 24
	}
})`
	flex: 1;
	padding-bottom: 36px;
`;
