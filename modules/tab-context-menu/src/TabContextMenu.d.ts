export type MenuAction = {
	id: string;
	title: string;
	icon?: string; // SF Symbol name
	destructive?: boolean;
};

export type TabMenuConfig = {
	tabIndex: number;
	actions: MenuAction[];
};

export type TabContextMenuActionEvent = {
	actionId: string;
	tabIndex: number;
};

export type TabContextMenuModuleEvents = {
	onAction: (params: TabContextMenuActionEvent) => void;
};
