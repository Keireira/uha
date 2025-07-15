import styled from 'styled-components/native';

export default styled.View<{ $isOldIOS: boolean }>`
	padding-right: ${({ $isOldIOS }) => ($isOldIOS ? '6px' : '12px')};
`;
