import journal from './meta/_journal.json';
import m0000 from './0000_motionless_ravenous.sql';
import m0001 from './0001_lively_alice.sql';

export default {
	journal,
	migrations: {
		m0000,
		m0001
	}
};
