import { processColor, type ColorValue } from 'react-native';
import {
	createModifier,
	createModifierWithEventListener,
	type ModifierConfig
} from '@expo/ui/swift-ui/modifiers';

export type SwipeEdge = 'leading' | 'trailing';
export type SwipeActionRole = 'default' | 'destructive' | 'cancel';

export type SwipeAction = {
	id: string;
	systemImage: string;
	onPress: () => void;
	tint?: ColorValue;
	role?: SwipeActionRole;
	/** Empty/omitted = icon-only button. Provide a string to show a label. */
	label?: string;
};

export type SwipeActionsConfig = {
	actions: SwipeAction[];
	edge?: SwipeEdge;
	allowsFullSwipe?: boolean;
};

const stripOnPress = (action: SwipeAction) => ({
	id: action.id,
	systemImage: action.systemImage,
	tint: action.tint != null ? processColor(action.tint) : undefined,
	role: action.role ?? 'default',
	label: action.label ?? ''
});

export const swipeActions = ({
	actions,
	edge = 'trailing',
	allowsFullSwipe = true
}: SwipeActionsConfig): ModifierConfig => {
	const handlers = new Map(actions.map((a) => [a.id, a.onPress]));

	return createModifierWithEventListener(
		'swipeActions',
		(payload: { id?: string }) => {
			if (payload?.id) handlers.get(payload.id)?.();
		},
		{
			edge,
			allowsFullSwipe,
			actions: actions.map(stripOnPress)
		}
	);
};

// Re-export for convenience when callers prefer composing manually.
export { createModifier };
