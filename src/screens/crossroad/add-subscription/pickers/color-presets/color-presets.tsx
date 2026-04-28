import React, { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';

import { useDraftStore } from '@screens/crossroad/add-subscription/hooks';
import { useShallow } from 'zustand/react/shallow';

import db from '@db';
import { eq } from 'drizzle-orm';
import { userTable } from '@db/schema';
import { USER_ID } from '@db/constants';

import { useAccent } from '@hooks';

import useStyles from './use-styles';
import Root, { CardGlass, CardInner } from './color-presets.styles';
import ColorPicker, { Panel1, Swatches, HueSlider, InputWidget } from 'reanimated-color-picker';

import type { ColorFormatsObject } from 'reanimated-color-picker';

const ColorPresets = () => {
	const router = useRouter();
	const styles = useStyles();
	const accent = useAccent();

		const { initialColor, setColor } = useDraftStore(
			useShallow((state) => ({
				initialColor: state.logo.color,
				setColor: state.actions.setSubscriptionColor
			}))
		);

	const [presets, setPresets] = useState<string[]>([]);
	/* Picker is uncontrolled relative to the store — confirm commits, cancel discards */
		const [pickerHex, setPickerHex] = useState(initialColor ?? accent);

	useEffect(() => {
		const loadPresets = async () => {
			const [user] = await db.select().from(userTable).where(eq(userTable.id, USER_ID)).execute();

			if (user) setPresets(user.color_presets);
		};

		loadPresets();
	}, []);

	const onColorChangeHd = (color: ColorFormatsObject) => {
		setPickerHex(color.hex);
	};

	const onConfirmHd = () => {
		setColor(pickerHex);
		router.back();
	};

	const onCancelHd = () => {
		router.back();
	};

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button icon="xmark" onPress={onCancelHd} tintColor={accent} />
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={onConfirmHd} tintColor={accent} />
			</Stack.Toolbar>

			<Root>
					<ColorPicker
						value={initialColor ?? accent}
					onCompleteJS={onColorChangeHd}
					thumbSize={28}
					thumbShape="ring"
					boundedThumb
					style={styles.picker}
				>
					<CardGlass>
						<CardInner>
							<Panel1 style={styles.panel} thumbSize={30} thumbInnerStyle={styles.panelThumbInner} />
							<HueSlider
								style={styles.slider}
								sliderThickness={32}
								thumbSize={28}
								thumbInnerStyle={styles.sliderThumbInner}
							/>
						</CardInner>
					</CardGlass>

					{presets.length > 0 && (
						<CardGlass>
							<CardInner>
								<Swatches colors={presets} swatchStyle={styles.swatch} style={styles.swatchesContainer} />
							</CardInner>
						</CardGlass>
					)}

					<CardGlass>
						<InputWidget
							defaultFormat="HEX"
							formats={['HEX']}
							disableAlphaChannel
							inputStyle={styles.input}
							inputTitleStyle={styles.inputTitle}
							containerStyle={styles.inputContainer}
						/>
					</CardGlass>
				</ColorPicker>
			</Root>
		</>
	);
};

export default ColorPresets;
