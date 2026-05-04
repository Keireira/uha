import journal from './meta/_journal.json';
import m0000 from './0000_outstanding_toxin.sql';
import m0001 from './0001_mushy_red_shift.sql';

export default {
	journal,
	migrations: {
		m0000,
		m0001
	}
};
