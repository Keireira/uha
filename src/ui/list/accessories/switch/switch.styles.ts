import styled from 'styled-components/native';

export default styled.View<{ $isOldIOS: boolean }>`
	padding-right: ${({ $isOldIOS }) => ($isOldIOS ? '0' : '12px')};
`;
