import React from 'react';
import styled, { useTheme } from 'styled-components/native';

import type { BaseToastProps } from 'react-native-toast-message';

const Container = styled.View<{ $borderColor: string }>`
	flex-direction: row;
	align-items: center;
	padding: 14px 16px;
	margin: 0 16px;
	border-radius: 14px;
	background-color: ${({ theme }) => theme.surface.default};
	border-left-width: 4px;
	border-left-color: ${({ $borderColor }) => $borderColor};
	shadow-color: ${({ theme }) => theme.shadow.default};
	shadow-offset: 0px 2px;
	shadow-opacity: 0.15;
	shadow-radius: 8px;
	elevation: 4;
`;

const TextWrapper = styled.View`
	flex: 1;
`;

const Title = styled.Text`
	font-family: 'Nunito';
	font-size: 15px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
`;

const Description = styled.Text`
	font-family: 'Nunito';
	font-size: 13px;
	font-weight: 400;
	color: ${({ theme }) => theme.text.secondary};
	margin-top: 2px;
`;

const ToastBody = ({ text1, text2, borderColor }: BaseToastProps & { borderColor: string }) => (
	<Container $borderColor={borderColor}>
		<TextWrapper>
			{text1 && <Title>{text1}</Title>}
			{text2 && <Description>{text2}</Description>}
		</TextWrapper>
	</Container>
);

const ErrorToast = (props: BaseToastProps) => {
	const theme = useTheme();
	return <ToastBody {...props} borderColor={theme.semantic.error} />;
};

const SuccessToast = (props: BaseToastProps) => {
	const theme = useTheme();
	return <ToastBody {...props} borderColor={theme.semantic.success} />;
};

const toastConfig = {
	error: (props: BaseToastProps) => <ErrorToast {...props} />,
	success: (props: BaseToastProps) => <SuccessToast {...props} />
};

export default toastConfig;
