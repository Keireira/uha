import appModel from './app-model';
import { useFactoryModel } from '@lib/effector';

const useAppModel = () => {
	const model = useFactoryModel(appModel);

	return model;
};

export default useAppModel;
