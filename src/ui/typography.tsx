import styled from 'styled-components/native';

type TextProps = {
	$bold?: boolean;
	$color?: string;
	$align?: 'left' | 'center' | 'right';
	$weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
};

export const BaseText = styled.Text`
	font-family: 'Nunito';
`;

// Header
export const H1 = styled(BaseText)<TextProps>`
	font-size: 28px;
	color: ${({ $color }) => $color || '#333'};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
`;

export const H2 = styled(BaseText)<TextProps>`
	font-size: 24px;
	color: ${({ $color }) => $color || '#333'};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
`;

export const H3 = styled(BaseText)<TextProps>`
	font-size: 20px;
	color: ${({ $color }) => $color || '#333'};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
`;

// Regular text
export const SmallText = styled(BaseText)<TextProps>`
	font-size: 12px;
	color: ${({ $color }) => $color || '#333'};
	text-align: ${({ $align }) => $align || 'left'};
	font-weight: ${({ $bold, $weight }) => $weight || ($bold ? '700' : '400')};
`;

export const Text = styled(BaseText)<TextProps>`
	font-size: 16px;
	color: ${({ $color }) => $color || '#333'};
	text-align: ${({ $align }) => $align || 'left'};
	font-weight: ${({ $bold, $weight }) => $weight || ($bold ? '700' : '400')};
`;

export const LargeText = styled(BaseText)<TextProps>`
	font-size: 18px;
	color: ${({ $color }) => $color || '#333'};
	text-align: ${({ $align }) => $align || 'left'};
	font-weight: ${({ $weight, $bold }) => $weight || ($bold ? '700' : '400')};
`;
