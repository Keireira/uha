import React, { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';

import db from '@db';
import { eq } from 'drizzle-orm';
import { userTable } from '@db/schema';

import { useAccent } from '@hooks';
import useStyles from './use-styles';
import { useNewSubStore } from '../../../hooks';

import Root, { CardGlass, CardInner } from './color-presets.styles';
import ColorPicker, { Panel1, Swatches, HueSlider, InputWidget } from 'reanimated-color-picker';

import type { ColorFormatsObject } from 'reanimated-color-picker';

const USER_ID = '00000000-0000-0000-0000-000000000000';

const ColorPresets = () => {
	const router = useRouter();
	const styles = useStyles();
	const settingAccent = useAccent();
	const { actions, ...service } = useNewSubStore((state) => state);

	const [presets, setPresets] = useState<string[]>([]);
	const [pickerHex, setLocalHex] = useState(service.color || '#778beb');

	useEffect(() => {
		const execute = async () => {
			const [user] = await db.select().from(userTable).where(eq(userTable.id, USER_ID)).execute();

			if (user) {
				setPresets(user.color_presets);
			}
		};

		execute();
	}, []);

	const updateLocalColor = (color: ColorFormatsObject) => {
		setLocalHex(color.hex);
	};

	const confirm = () => {
		actions.setColor(pickerHex);
		router.back();
	};

	const back = () => router.back();

	return (
		<>
			<Stack.Toolbar placement="left">
				<Stack.Toolbar.Button icon="xmark" onPress={back} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Stack.Toolbar placement="right">
				<Stack.Toolbar.Button variant="done" icon="checkmark" onPress={confirm} tintColor={settingAccent} />
			</Stack.Toolbar>

			<Root>
				<ColorPicker
					value={service.color}
					onCompleteJS={updateLocalColor}
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
