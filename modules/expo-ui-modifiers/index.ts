import { processColor, type ColorValue } from 'react-native';
import { createModifier, createModifierWithEventListener, type ModifierConfig } from '@expo/ui/swift-ui/modifiers';

/* ─────────────────────────────────────────────────────────────────────────────
 * scrollIndicators (for views)
 */

export type ScrollIndicatorsVisibility = 'automatic' | 'visible' | 'hidden' | 'never';

export const scrollIndicators = (visibility: ScrollIndicatorsVisibility = 'hidden'): ModifierConfig => {
	return createModifier('scrollIndicators', { visibility });
};

/* ─────────────────────────────────────────────────────────────────────────────
 * locale (sets `\.locale` environment, e.g. for DatePicker)
 */

export const locale = (identifier: string): ModifierConfig => {
	return createModifier('locale', { identifier });
};

/* ─────────────────────────────────────────────────────────────────────────────
 * firstWeekday (sets `\.calendar.firstWeekday`, e.g. for DatePicker)
 */

export type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export const firstWeekday = (day: Weekday): ModifierConfig => {
	return createModifier('firstWeekday', { day });
};

/* ─────────────────────────────────────────────────────────────────────────────
 * swipeActions (for views)
 */

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
			if (payload?.id) {
				handlers.get(payload.id)?.();
			}
		},
		{
			edge,
			allowsFullSwipe,
			actions: actions.map(stripOnPress)
		}
	);
};

export { createModifier };
