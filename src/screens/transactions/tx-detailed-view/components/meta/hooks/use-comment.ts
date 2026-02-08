import { useState, useEffect, useCallback } from 'react';

import db from '@db';
import { eq } from 'drizzle-orm';
import { transactionsTable } from '@db/schema';

import type { Props } from '../meta.d';

const useComment = ({ id, comment }: Props) => {
	const [note, setNote] = useState(comment ?? '');

	const updateComment = useCallback(
		async (comment: string) => {
			await db.update(transactionsTable).set({ comment }).where(eq(transactionsTable.id, id));
		},
		[id]
	);

	useEffect(() => {
		setNote(comment ?? '');
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [id]);

	const handleBlur = useCallback(() => {
		const trimmed = note.trim();

		if (trimmed !== (comment ?? '')) {
			updateComment(trimmed);
		}
	}, [note, comment, updateComment]);

	return {
		note,
		setNote,
		handleBlur
	};
};

export default useComment;
