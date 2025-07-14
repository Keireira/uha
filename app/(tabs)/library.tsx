import React from 'react';
import { Text, Wrapper } from '@ui';
import { ScrollView } from 'react-native';
import { useScrollDirection } from '@hooks';
import styled, { css } from 'styled-components/native';

const ListTextTest = styled(Text)<{ $isLast: boolean }>`
	font-size: 36px;
	font-weight: 800;
	color: #add8e690;
	padding: 16px;
	margin-left: 8px;
	margin-right: 8px;
	border-radius: 8px;
	text-shadow: 2px 2px 2px pink;
	margin-top: 8px;

	${({ $isLast }) =>
		$isLast &&
		css`
			margin-bottom: 8px;
		`}
`;

const Library = () => {
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={ScrollView} onScroll={handleScroll}>
			{Array.from({ length: 25 }).map((_, index, arr) => (
				<ListTextTest key={index} $isLast={index === arr.length - 1}>
					{`${index + 1}`.padStart(2, '❦')}: 泉 こなた
				</ListTextTest>
			))}
		</Wrapper>
	);
};

export default Library;
