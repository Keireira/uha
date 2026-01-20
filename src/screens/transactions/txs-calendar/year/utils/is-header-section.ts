import type { HeaderRowT, QuarterRowT } from '../year.d';

const isHeaderSection = (row: HeaderRowT | QuarterRowT): row is HeaderRowT => {
	return row.kind === 'header';
};

export default isHeaderSection;
