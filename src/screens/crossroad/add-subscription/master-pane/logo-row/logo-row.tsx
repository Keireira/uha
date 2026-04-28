import React from 'react';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { useTheme } from 'styled-components/native';

import db from '@db';
import { eq } from 'drizzle-orm';
import { categoriesTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { isLight } from '@lib/colors';
import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';

import { LogoView } from '@ui';
import { SymbolView } from 'expo-symbols';
import Root, { LogoPressable, EditBadge, SideSlot, SideButton, FillPress } from './logo-row.styles';

const logoKeys = ['image_uri', 'symbol', 'color'] as const;
const blank = (v: unknown) => (v == null || v === '' ? null : v);

const LogoRow = () => {
	const theme = useTheme();
	const router = useRouter();
	const settingAccent = useAccent();

		const draft = useDraftStore(
			useShallow((state) => ({
				custom_name: state.custom_name,
				logo: state.logo,
				category_slug: state.category_slug,
				logoSnapshot: state.logoSnapshot
			}))
		);
	const resetLogo = useDraftStore((state) => state.actions.resetLogo);

		const {
			data: [category]
		} = useLiveQuery(db.select().from(categoriesTable).where(eq(categoriesTable.slug, draft.category_slug)), [
			draft.category_slug
		]);

		const isLogoDirty = logoKeys.some((key) => blank(draft.logo[key]) !== blank(draft.logoSnapshot[key]));
		const logoColor = draft.logo.color ?? settingAccent;

		const openLogoEditor = () => {
			router.push({
				pathname: '/edit-logo-sheet',
				params: {
					logo_url: draft.logo.image_uri,
					symbol: draft.logo.symbol,
					color: logoColor
				}
			});
	};

	const openColorPresets = () => {
		router.push('/color-presets');
	};

	return (
		<Root>
			<SideSlot>
				{isLogoDirty && (
					<SideButton glassEffectStyle="clear" isInteractive>
						<FillPress onPress={resetLogo}>
							<SymbolView size={22} name="arrow.clockwise" tintColor={settingAccent} />
						</FillPress>
					</SideButton>
				)}
			</SideSlot>

			<LogoPressable onPress={openLogoEditor}>
					<LogoView
						name={draft.custom_name}
						symbolName={draft.logo.symbol}
						emoji={category?.emoji}
						url={draft.logo.image_uri}
						color={logoColor}
						size={96}
					/>

				<EditBadge isInteractive>
					<SymbolView size={18} name="pencil" tintColor={settingAccent} />
				</EditBadge>
			</LogoPressable>

			<SideSlot>
					<SideButton glassEffectStyle="clear" isInteractive tintColor={logoColor}>
						<FillPress onPress={openColorPresets}>
							<SymbolView
								size={22}
								name="paintbrush.fill"
								tintColor={isLight(logoColor) ? theme.static.black : theme.static.white}
							/>
					</FillPress>
				</SideButton>
			</SideSlot>
		</Root>
	);
};

export default LogoRow;
