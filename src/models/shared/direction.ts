import { create } from 'zustand';

type ScrollDirection = 'up' | 'down' | 'idle';

const THRESHOLD = 10;

type DirectionState = {
	direction: ScrollDirection;
};

type DirectionActions = {
	handleScrollY: (y: number) => void;
};

let lastY = 0;

const useDirectionStore = create<DirectionState & DirectionActions>((set, get) => ({
	direction: 'idle',

	handleScrollY: (y: number) => {
		const delta = y - lastY;
		lastY = y;

		const next = delta > THRESHOLD ? 'down' : delta < -THRESHOLD ? 'up' : null;

		if (next && next !== get().direction) {
			set({ direction: next });
		}
	}
}));

export default useDirectionStore;
