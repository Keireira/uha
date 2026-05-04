import journal from './meta/_journal.json';
import m0000 from './0000_public_kulan_gath.sql';
import m0001 from './0001_strange_loki.sql';

export default {
	journal,
	migrations: {
		m0000,
		m0001
	}
};
