import styled from 'styled-components/native';
import { Host } from '@expo/ui/swift-ui';

import type { Props } from './divider.d';

export default styled(Host)<{ $gap?: Props['gap'] }>`
	margin-vertical: ${({ $gap }) => $gap}px;
`;
