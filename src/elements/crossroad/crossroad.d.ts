import type { Href } from 'expo-router';

export type Props = {
	isOpened: boolean;
	onIsOpenedChange: (isOpened: boolean) => void;
};

export type RouteT = {
	id: number;
	title: string;
	route: Href;
};
