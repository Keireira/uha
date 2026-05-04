import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, useRouter } from 'expo-router';

import { useAccent } from '@hooks';
import { useSaveCategory } from '@screens/library/categories/details/hooks';

import type { CategoryT } from '@models';
import type { CategoryEditParams } from '@screens/library/categories';

type Props = {
	initDraft: CategoryT;
	draft: CategoryEditParams;
};

const Header = ({ initDraft, draft }: Props) => {
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();

	const saveCategory = useSaveCategory();

	const screenTitle = useMemo(() => {
		if (!initDraft) return '';

		if (initDraft.title) {
			return initDraft.title;
		}

		return t(`category.${initDraft.slug}`, { defaultValue: initDraft.slug });
	}, [initDraft, t]);

	const closeModal = () => {
		router.back();
	};

	const save = () => {
		if (!initDraft) return;

		saveCategory(initDraft, draft);
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button variant="plain" icon="xmark" onPress={closeModal} />
			</Stack.Toolbar>

			<Stack.Screen options={{ title: screenTitle }} />

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>
		</>
	);
};

export default Header;
