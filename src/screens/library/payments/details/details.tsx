import React, { useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { tendersTable } from '@db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';

import {
	font,
	tint,
	listStyle,
	lineLimit,
	onTapGesture,
	truncationMode,
	foregroundStyle,
	scrollDismissesKeyboard,
	multilineTextAlignment
} from '@expo/ui/swift-ui/modifiers';
import {
	Host,
	Text,
	List,
	HStack,
	Image,
	Toggle,
	Section,
	TextField,
	ColorPicker,
	LabeledContent
} from '@expo/ui/swift-ui';

const PaymentDetails = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const { id } = useLocalSearchParams<{ id: string }>();

	const {
		data: [payment]
	} = useLiveQuery(db.select().from(tendersTable).where(eq(tendersTable.id, id)).limit(1), [id]);

	const [title, setTitle] = useState('');
	const [emoji, setEmoji] = useState('');
	const [color, setColor] = useState('');
	const [comment, setComment] = useState('');
	const [isCard, setIsCard] = useState(false);

	useEffect(() => {
		if (!payment) return;

		setTitle(payment.title);
		setEmoji(payment.emoji);
		setColor(payment.color);
		setComment(payment.comment ?? '');
		setIsCard(payment.is_card);
	}, [payment]);

	const copyId = () => {
		if (!payment) return;

		Clipboard.setString(payment.id);

		Toast.show({
			type: 'success',
			text1: t('library.details.id_copied'),
			text2: payment.id
		});
	};

	const save = async () => {
		if (!payment) return;

		const nextTitle = title.trim();
		const nextEmoji = emoji.trim();
		const nextColor = color.trim();
		const nextComment = comment.trim();

		if (!nextTitle || !nextEmoji || !nextColor) return;

		try {
			await db
				.update(tendersTable)
				.set({
					title: nextTitle,
					emoji: nextEmoji,
					color: nextColor,
					comment: nextComment,
					is_card: isCard
				})
				.where(eq(tendersTable.id, payment.id));

			router.back();
		} catch (err) {
			console.warn('[payment-details] save failed:', err);
		}
	};

	if (!payment) return null;

	const labelMods = [font({ size: 16, weight: 'regular' })];
	const valueMods = [
		multilineTextAlignment('trailing'),
		foregroundStyle(theme.text.secondary),
		font({ size: 16, weight: 'regular' })
	];
	const idValueMods = [
		multilineTextAlignment('trailing'),
		foregroundStyle(theme.text.secondary),
		font({ size: 13, design: 'monospaced', weight: 'regular' }),
		lineLimit(1),
		truncationMode('middle')
	];

	return (
		<>
			<Stack.Screen options={{ title: payment.title || '' }} />

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={save} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Host style={{ flex: 1 }}>
				<List modifiers={[listStyle('insetGrouped'), scrollDismissesKeyboard('immediately')]}>
					<Section title={t('library.details.section.identity')}>
						<LabeledContent label={t('library.details.fields.id')} modifiers={[onTapGesture(copyId)]}>
							<HStack spacing={6}>
								<Text modifiers={idValueMods}>{payment.id}</Text>
								<Image systemName="doc.on.doc" size={13} color={withAlpha(settingAccent, 0.6)} />
							</HStack>
						</LabeledContent>

						<LabeledContent label={t('library.details.fields.title')} modifiers={labelMods}>
							<TextField defaultValue={payment?.title ?? ''} onValueChange={setTitle} modifiers={valueMods} />
						</LabeledContent>
					</Section>

					<Section title={t('library.details.section.appearance')}>
						<LabeledContent label={t('library.details.fields.emoji')} modifiers={labelMods}>
							<TextField
								defaultValue={payment.emoji}
								placeholder="One emoji to symbolize"
								onValueChange={(v) => setEmoji(v.slice(-8))}
								modifiers={valueMods}
							/>
						</LabeledContent>

						<ColorPicker
							label={t('library.details.fields.color')}
							selection={color || null}
							onSelectionChange={setColor}
							supportsOpacity={false}
						/>
					</Section>

					<Section title={t('library.details.section.other')}>
						<LabeledContent label={t('library.details.fields.comment')} modifiers={labelMods}>
							<TextField
								defaultValue={payment?.comment ?? ''}
								placeholder="* 7482"
								onValueChange={setComment}
								modifiers={valueMods}
							/>
						</LabeledContent>

						<Toggle
							label={t('library.details.fields.card')}
							modifiers={[tint(settingAccent)]}
							isOn={isCard}
							onIsOnChange={setIsCard}
						/>
					</Section>
				</List>
			</Host>
		</>
	);
};

export default PaymentDetails;
