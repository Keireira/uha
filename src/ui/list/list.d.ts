import type { StyleProp, ViewStyle } from 'react-native';
import type { Props as ListSectionProps } from './list-section';

export type Props = {
	sections: ListSectionProps[];
	style?: StyleProp<ViewStyle>;
};
