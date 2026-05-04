import React from 'react';
import { useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { LogoView } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { LogoPressable, EditBadge } from './logo-row.styles';

const LogoRow = () => {
	const router = useRouter();
	const settingAccent = useAccent();

	const logo = useDraftStore((state) => state.logo);
	const customName = useDraftStore((state) => state.custom_name);
	const categorySlug = useDraftStore((state) => state.category_slug);

	const {
		data: [category]
	} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, categorySlug)).limit(1), [
		categorySlug
	]);

	const openLogoEditor = () => {
		router.push({
			pathname: '/(pickers)/select-symbol-logo',
			params: {
				target: 'add_subscription_logo'
			}
		});
	};

	return (
		<Root>
			<LogoPressable onPress={openLogoEditor}>
				<LogoView
					name={customName}
					symbolName={logo.symbol}
					emoji={category?.emoji}
					url={logo.image_uri}
					color={logo.color ?? settingAccent ?? null}
					size={96}
				/>

				<EditBadge isInteractive>
					<SymbolView size={18} name="pencil" tintColor={settingAccent} />
				</EditBadge>
			</LogoPressable>
		</Root>
	);
};

export default LogoRow;
