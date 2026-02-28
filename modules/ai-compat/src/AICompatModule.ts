import { requireNativeModule } from 'expo';

type AICompatModuleT = {
	isSupported(): boolean;
};

export default requireNativeModule<AICompatModuleT>('AICompat');
