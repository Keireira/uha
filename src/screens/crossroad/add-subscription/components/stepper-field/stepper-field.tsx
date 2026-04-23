import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'styled-components/native';
import { useGlassStyle } from '@hooks';
import { clamp } from 'ramda';

import { TextField } from '@ui';
import { SymbolView } from 'expo-symbols';
import { keyboardType } from '@expo/ui/swift-ui/modifiers';
import Root, { GlassButton, InnerButton, ValueWrap, InputWrap, Unit } from './stepper-field.styles';

import type { TextFieldRef } from '@ui';
import type { Props } from './stepper-field.d';
import type { BillingCycleT } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

import { PERIOD_LIMITS } from '@screens/crossroad/add-subscription/hooks/use-draft-store';

const useMinMaxValues = (type: BillingCycleT) => {
	const { min, max } = PERIOD_LIMITS[type];

	return {
		minValue: min,
		maxValue: max
	};
};

const formatValue = (value: number | string) => `${value || ''}`;

const StepperField = ({ type, value, setValue }: Props) => {
	const theme = useTheme();
	const glassEffectStyle = useGlassStyle();

	const { minValue, maxValue } = useMinMaxValues(type);

	const textRef = useRef<TextFieldRef>(null);
	const [localType, setLocalType] = useState(type);
	const [localValue, setLocalValue] = useState(formatValue(value));

	/* Keep the native field in sync when value changes externally (stepper, presets, unit convert) */
	useEffect(() => {
		const expectedValue = formatValue(value);

		if (expectedValue === localValue && localType === type) {
			return;
		}

		const expected = formatValue(normalize(expectedValue));

		setLocalType(type);
		setLocalValue(expected);
		textRef.current?.setText(expected);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, type]);

	const normalize = (value: string) => {
		const parsed = Number.parseInt(value, 10);
		const clamped = Number.isFinite(parsed) ? clamp(minValue, maxValue, parsed) : parsed;

		return clamped;
	};

	const commitValue = (next: number) => {
		const clamped = clamp(minValue, maxValue, next);

		if (clamped !== value) {
			setValue(type, clamped);
		}
	};

	const onAddValueHd = () => {
		commitValue(value + 1);
	};

	const onSubtractValueHd = () => {
		commitValue(value - 1);
	};

	const handleTextChange = (next: string) => {
		/*
		 * Strip anything that's not a digit,
		 * just in case, since the user might Cmd-V a non-numeric character
		 */
		const digits = next.trim().replace(/\D/g, '');
		const parsed = Number.parseInt(digits, 10);
		if (parsed === value) return;

		setLocalValue(digits);

		if (Number.isFinite(parsed) && parsed >= minValue && parsed <= maxValue) {
			setValue(type, parsed);
		}
	};

	const handleFocusChange = (focused: boolean) => {
		if (focused) return;

		const clamped = normalize(localValue);
		const expected = formatValue(clamped);

		if (clamped !== value) {
			setValue(type, clamped);
		}

		if (expected !== localValue) {
			setLocalValue(expected);
			textRef.current?.setText(expected);
		}
	};

	const isMinDisabled = value - 1 < minValue;
	const isMaxDisabled = value + 1 > maxValue;

	return (
		<Root>
			<GlassButton glassEffectStyle={glassEffectStyle} isInteractive={!isMinDisabled} $disabled={isMinDisabled}>
				<InnerButton onPress={onSubtractValueHd} disabled={isMinDisabled}>
					<SymbolView name="minus" size={20} tintColor={theme.text.primary} />
				</InnerButton>
			</GlassButton>

			<ValueWrap>
				<InputWrap>
					<TextField
						ref={textRef}
						defaultValue={localValue}
						onValueChange={handleTextChange}
						onFocusChange={handleFocusChange}
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
				<InnerButton onPress={onAddValueHd} disabled={isMaxDisabled}>
					<SymbolView name="plus" size={20} tintColor={theme.text.primary} />
				</InnerButton>
			</GlassButton>
		</Root>
	);
};

export default StepperField;
