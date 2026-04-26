import React from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';

import { useGlassStyle } from '@hooks';
import { useDraftStore } from '../../../../hooks';
import { EVENT_META, EVENT_ORDER, availableEventTypes } from '../../../../events';

import { Modal } from 'react-native';
import { SymbolView } from 'expo-symbols';
import {
	TypePickerBackdrop,
	TypePickerSheet,
	TypePickerTitle,
	TypeChipGrid,
	TypeChipWrap,
	TypeChip,
	TypeChipLabel
} from './add-event-modal.styles';

import type { EventTypeT } from '../../../../events';

type Props = {
	isPickerVisible: boolean;
	setIsPickerVisible: (value: boolean) => void;
};

const AddEventModal = ({ isPickerVisible, setIsPickerVisible }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	const glassEffectStyle = useGlassStyle();

	const setWithTrial = useDraftStore((state) => state.actions.setWithTrial);
	const timeline = useDraftStore((state) => state.timeline);

	const closeTypePicker = () => setIsPickerVisible(false);

	const handleTypeSelect = (type: EventTypeT) => () => {
		setIsPickerVisible(false);

		// Trial has its own picker. Materialize the event first (with a safe
		// default start date derived from first_payment_date − duration) so the
		// dedicated screen always has something to edit.
		if (type === 'trial') {
			setWithTrial(true);
			router.push({
				pathname: '/(crossroad)/trial-duration',
				params: { from: 'timeline' }
			});
			return;
		}

		router.push({
			pathname: '/(pickers)/edit-event',
			params: { type }
		});
	};

	const availableTypes = availableEventTypes(timeline);

	return (
		<Modal visible={isPickerVisible} transparent animationType="fade" onRequestClose={closeTypePicker}>
			<TypePickerBackdrop onPress={closeTypePicker}>
				<TypePickerSheet glassEffectStyle={glassEffectStyle}>
					<TypePickerTitle>Pick event type</TypePickerTitle>

					<TypeChipGrid>
						{EVENT_ORDER.filter((type) => availableTypes.has(type)).map((type) => {
							const meta = EVENT_META[type];
							const tone = theme.accents[meta.accent];

							return (
								<TypeChipWrap key={type}>
									<TypeChip $tone={tone} onPress={handleTypeSelect(type)}>
										<SymbolView name={meta.symbol} size={14} tintColor={tone} weight="bold" />
										<TypeChipLabel $tone={tone}>{meta.label}</TypeChipLabel>
									</TypeChip>
								</TypeChipWrap>
							);
						})}
					</TypeChipGrid>
				</TypePickerSheet>
			</TypePickerBackdrop>
		</Modal>
	);
};

export default AddEventModal;
