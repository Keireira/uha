import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'styled-components/native';
import { useGlassStyle } from '@hooks';
import { clamp } from 'ramda';

import { TextField } from '@ui';
import { SymbolView } from 'expo-symbols';
import { keyboardType } from '@expo/ui/swift-ui/modifiers';
import Root, { GlassButton, InnerButton, ValueWrap, InputWrap, Unit } from './stepper-field.styles';

import { PERIOD_LIMITS } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

import type { TextFieldRef } from '@ui';
import type { Props } from './stepper-field.d';
import type { BillingCycleT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

const useLimits = (type: BillingCycleT) => PERIOD_LIMITS[type];
const formatValue = (value: number) => (value ? String(value) : '');

const StepperField = ({ type, value, setValue }: Props) => {
	const theme = useTheme();
	const glassEffectStyle = useGlassStyle();

	const { min, max } = useLimits(type);
	const textRef = useRef<TextFieldRef>(null);
	const [localType, setLocalType] = useState(type);
	const [localValue, setLocalValue] = useState(formatValue(value));

	/* Sync native field when value/type change externally (presets, unit convert) */
	useEffect(() => {
		const external = formatValue(value);
		const isValueInRange = value >= min && value <= max;

		if (external === localValue && localType === type && isValueInRange) {
			return;
		}

		const clamped = formatValue(clamp(min, max, value));

		setLocalType(type);
		setLocalValue(clamped);
		textRef.current?.setText(clamped);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, type]);

	const commitValue = (next: number) => {
		const clamped = clamp(min, max, next);

		if (clamped !== value) {
			setValue(type, clamped);
		}
	};

	const onIncrementHd = () => commitValue(value + 1);
	const onDecrementHd = () => commitValue(value - 1);

	const onTextChangeHd = (next: string) => {
		const digits = next.trim().replace(/\D/g, '');
		setLocalValue(digits);

		const parsed = Number.parseInt(digits, 10);

		if (Number.isFinite(parsed) && parsed >= min && parsed <= max && parsed !== value) {
			setValue(type, parsed);
		}
	};

	const onFocusChangeHd = (focused: boolean) => {
		if (focused) return;

		const parsed = Number.parseInt(localValue, 10);
		const clamped = Number.isFinite(parsed) ? clamp(min, max, parsed) : min;
		const expected = formatValue(clamped);

		if (clamped !== value) {
			setValue(type, clamped);
		}

		if (expected !== localValue) {
			setLocalValue(expected);
			textRef.current?.setText(expected);
		}
	};

	const isMinDisabled = value <= min;
	const isMaxDisabled = value >= max;

	return (
		<Root>
			<GlassButton glassEffectStyle={glassEffectStyle} isInteractive={!isMinDisabled} $disabled={isMinDisabled}>
				<InnerButton onPress={onDecrementHd} disabled={isMinDisabled}>
					<SymbolView name="minus" size={20} tintColor={theme.text.primary} />
				</InnerButton>
			</GlassButton>

			<ValueWrap>
				<InputWrap>
					<TextField
						ref={textRef}
						defaultValue={localValue}
						onValueChange={onTextChangeHd}
						onFocusChange={onFocusChangeHd}
						fontSize={64}
						align="center"
						fontWeight="bold"
						matchContents={{ vertical: true }}
						modifiers={[keyboardType('numeric')]}
					/>
				</InputWrap>

				<Unit>{type}</Unit>
			</ValueWrap>

			<GlassButton glassEffectStyle={glassEffectStyle} isInteractive={!isMaxDisabled} $disabled={isMaxDisabled}>
				<InnerButton onPress={onIncrementHd} disabled={isMaxDisabled}>
					<SymbolView name="plus" size={20} tintColor={theme.text.primary} />
				</InnerButton>
			</GlassButton>
		</Root>
	);
};

export default StepperField;
