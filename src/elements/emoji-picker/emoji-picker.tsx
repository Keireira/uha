import React from 'react';
import { ScrollView } from 'react-native';

import { EMOJI_SECTIONS } from './emojis';
import { SectionTitle, Grid, EmojiCell, EmojiText, SelectedCell } from './emoji-picker.styles';

type Props = {
	selected?: string;
	onSelect: (emoji: string) => void;
};

const EmojiPicker = ({ selected, onSelect }: Props) => {
	return (
		<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
			{EMOJI_SECTIONS.map((section) => (
				<React.Fragment key={section.title}>
					<SectionTitle>{section.title}</SectionTitle>
					<Grid>
						{section.emojis.map((emoji) => {
							const isSelected = selected === emoji;

							return isSelected ? (
								<SelectedCell key={emoji}>
									<EmojiText>{emoji}</EmojiText>
								</SelectedCell>
							) : (
								<EmojiCell key={emoji} onPress={() => onSelect(emoji)}>
									<EmojiText>{emoji}</EmojiText>
								</EmojiCell>
							);
						})}
					</Grid>
				</React.Fragment>
			))}
		</ScrollView>
	);
};

export default EmojiPicker;
