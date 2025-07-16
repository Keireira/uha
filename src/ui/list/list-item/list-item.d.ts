import type {
	AccessoryContextMenuT,
	AccessorySwitchT,
	AccessoryDrumrollT,
	AccessoryPlainActionMenuT,
	AccessoryTextMenuT
} from '../accessories';

export type AccessoryT =
	| AccessorySwitchT
	| AccessoryContextMenuT
	| AccessoryDrumrollT
	| AccessoryPlainActionMenuT
	| AccessoryTextMenuT;

export type Props = {
	id: string;
	title: string;
	accessory: AccessoryT;
};
