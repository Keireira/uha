import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';

import { colorMix } from '@lib/color-utils';
import { EMOJI_SECTIONS } from './emojis';
import { Grid, EmojiCell, EmojiText } from './emoji-picker.styles';

type Props = {
	color?: string;
	selected?: string;
	onSelect: (emoji: string) => void;
};

const EmojiPicker = ({ color, selected, onSelect }: Props) => {
	const theme = useTheme();

	const cellBg = useMemo(
		() => colorMix(color || '#ffffff', theme.background.default, 0.4),
		[color, theme.background.default]
	);

	const allEmojis = useMemo(() => EMOJI_SECTIONS.flatMap((s) => s.emojis), []);

	return (
		<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
			<Grid>
				{allEmojis.map((emoji) => (
					<EmojiCell
						key={emoji}
						$bg={selected === emoji ? 'rgba(255,255,255,0.35)' : cellBg}
						onPress={() => onSelect(emoji)}
					>
						<EmojiText>{emoji}</EmojiText>
					</EmojiCell>
				))}
			</Grid>
		</ScrollView>
	);
};

export default EmojiPicker;
