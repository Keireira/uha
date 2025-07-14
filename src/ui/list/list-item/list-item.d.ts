import type {
	AccessoryContextMenuT,
	AccessorySwitchT,
	AccessoryDrumrollT,
	AccessoryPlainActionMenuT
} from '../accessories';

export type AccessoryT = AccessorySwitchT | AccessoryContextMenuT | AccessoryDrumrollT | AccessoryPlainActionMenuT;

export type Props = {
	id: string;
	title: string;
	accessory: AccessoryT;
};
