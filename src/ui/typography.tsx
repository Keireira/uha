import styled from 'styled-components/native';

type TextProps = {
	$bold?: boolean;
};

export const BaseText = styled.Text`
	font-family: 'Nunito';
`;

// Header
export const H1 = styled(BaseText)`
	font-size: 28px;
	font-weight: 700;
`;

export const H2 = styled(BaseText)`
	font-size: 24px;
	font-weight: 700;
`;

export const H3 = styled(BaseText)`
	font-size: 20px;
	font-weight: 700;
`;

// Regular text
export const SmallText = styled(BaseText)<TextProps>`
	font-size: 12px;
	font-weight: ${({ $bold }) => ($bold ? '700' : '400')};
`;

export const Text = styled(BaseText)<TextProps>`
	font-size: 16px;
	font-weight: ${({ $bold }) => ($bold ? '700' : '400')};
`;

export const LargeText = styled(BaseText)<TextProps>`
	font-size: 18px;
	font-weight: 400;
`;
