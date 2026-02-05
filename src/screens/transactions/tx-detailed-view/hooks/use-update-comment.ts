import { useCallback } from 'react';

import db from '@db';
import { eq } from 'drizzle-orm';
import { transactionsTable } from '@db/schema';

const useUpdateComment = (transactionId: string) => {
	const updateComment = useCallback(
		(comment: string) => {
			db.update(transactionsTable).set({ comment }).where(eq(transactionsTable.id, transactionId));
		},
		[transactionId]
	);

	return updateComment;
};

export default useUpdateComment;
