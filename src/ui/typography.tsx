import styled from 'styled-components/native';

type TextProps = {
	$bold?: boolean;
	$color?: string;
	$align?: 'left' | 'center' | 'right';
	$transform?: 'capitalize' | 'uppercase' | 'lowercase';
	$weight?: 200 | 250 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
};

export const BaseText = styled.Text.attrs({
	allowFontScaling: true,
	adjustsFontSizeToFit: true
})`
	font-family: 'Nunito';
`;

// Header
export const H1 = styled(BaseText)<TextProps>`
	font-size: 28px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
`;

export const H2 = styled(BaseText)<TextProps>`
	font-size: 24px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
`;

export const H3 = styled(BaseText)<TextProps>`
	font-size: 20px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
`;

export const H4 = styled(BaseText)<TextProps>`
	font-size: 18px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
`;

export const H5 = styled(BaseText)<TextProps>`
	font-size: 16px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
`;

export const H6 = styled(BaseText)<TextProps>`
	font-size: 14px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	font-weight: ${({ $weight }) => $weight || 700};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
`;

// Regular text
export const SmallText = styled(BaseText)<TextProps>`
	font-size: 12px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
	font-weight: ${({ $bold, $weight }) => $weight || ($bold ? '700' : '400')};
`;

export const Text = styled(BaseText)<TextProps>`
	font-size: 16px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
	font-weight: ${({ $bold, $weight }) => $weight || ($bold ? '700' : '400')};
`;

export const LargeText = styled(BaseText)<TextProps>`
	font-size: 18px;
	color: ${({ $color, theme }) => $color || theme.text.primary};
	text-align: ${({ $align }) => $align || 'left'};
	text-transform: ${({ $transform }) => $transform || 'unset'};
	font-weight: ${({ $weight, $bold }) => $weight || ($bold ? '700' : '400')};
`;

// iOS Titles
export const LargeTitleIOS = styled(BaseText)<TextProps>`
	font-size: 34px;
	font-weight: 700;
	color: ${({ $color, theme }) => $color || theme.text.primary};
`;

export const InlineTitleIOS = styled(BaseText)<TextProps>`
	font-size: 17px;
	font-weight: 600;
	color: ${({ $color, theme }) => $color || theme.text.primary};
`;

export const SubtitleIOS = styled(BaseText)<TextProps>`
	font-size: 12px;
	font-weight: 400;
	color: ${({ $color, theme }) => $color || theme.text.primary};
`;
