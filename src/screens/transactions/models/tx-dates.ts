import { create } from 'zustand';
import { startOfMonth, endOfMonth, startOfToday } from 'date-fns';

type TxDatesState = {
	focusedDate: Date;
	selectedDate: Date;
	activeMonth: Date;
	maxActiveDate: Date;
	minActiveDate: Date;
};

type TxDatesActions = {
	setFocusedDate: (date: Date) => void;
	setSelectedDate: (date: Date) => void;
	setActiveMonth: (date: Date) => void;
	setMaxActiveDate: (date: Date) => void;
	setMinActiveDate: (date: Date) => void;
};

const useTxDatesStore = create<TxDatesState & TxDatesActions>((set) => ({
	focusedDate: startOfToday(),
	selectedDate: startOfToday(),
	activeMonth: startOfMonth(new Date()),
	maxActiveDate: endOfMonth(new Date()),
	minActiveDate: startOfMonth(new Date()),

	setFocusedDate: (date) => set({ focusedDate: date }),
	setSelectedDate: (date) => set({ selectedDate: date }),
	setActiveMonth: (date) => set({ activeMonth: date }),
	setMaxActiveDate: (date) => set({ maxActiveDate: date }),
	setMinActiveDate: (date) => set({ minActiveDate: date })
}));

export default useTxDatesStore;
