import { isAfter, startOfToday } from 'date-fns';

export const isAfterToday = (date: Date | string) => isAfter(date, startOfToday());
