import type { TextInputProps } from 'react-native';
import type { IconNameT } from '../icons';

export type Props = TextInputProps & {
	leadingIcon?: IconNameT;
};
