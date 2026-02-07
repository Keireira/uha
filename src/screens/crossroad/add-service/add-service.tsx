import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LogoView } from '@ui';
import { SymbolView } from 'expo-symbols';
import { ColorPicker } from '@elements';
import useAddService from './use-add-service';
import {
	Container,
	Header,
	Title,
	CloseGlass,
	CloseInner,
	Field,
	FieldLabel,
	Input,
	ResultItem,
	ResultTitle,
	ResultSubtitle,
	CreateButton,
	CreateButtonLabel,
	CategoryOption,
	CategoryEmoji,
	CategoryLabel,
	CategoriesList,
	PlaceholderText,
	EmojiPreview,
	SaveButton,
	SaveLabel,
	Divider
} from './add-service.styles';

const AddServiceScreen = () => {
	const theme = useTheme();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const {
		search,
		setSearch,
		mode,
		title,
		setTitle,
		color,
		setColor,
		selectedCategoryId,
		setSelectedCategoryId,
		showColorPicker,
		setShowColorPicker,
		categories,
		filteredResults,
		isValid,
		switchToCreate,
		save
	} = useAddService();

	return (
		<Container contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}>
			<Header>
				<Title>New Service</Title>
				<CloseGlass isInteractive>
					<CloseInner onPress={() => router.back()} hitSlop={10}>
						<SymbolView name="xmark" size={16} weight="bold" tintColor={theme.text.tertiary} />
					</CloseInner>
				</CloseGlass>
			</Header>

			{mode === 'search' ? (
				<>
					<Field>
						<FieldLabel>Search</FieldLabel>
						<Input
							value={search}
							onChangeText={setSearch}
							placeholder="Search existing services..."
							placeholderTextColor={`${theme.text.tertiary}75`}
							autoFocus
						/>
					</Field>

					{filteredResults.length > 0 && (
						<Field>
							{filteredResults.map((service) => (
								<ResultItem key={service.id}>
									<LogoView name={service.title} emoji={undefined} color={service.color} size={40} />
									<View>
										<ResultTitle>{service.title}</ResultTitle>
										<ResultSubtitle>{service.slug}</ResultSubtitle>
									</View>
								</ResultItem>
							))}
						</Field>
					)}

					<Divider />

					<CreateButton onPress={switchToCreate}>
						<CreateButtonLabel>+ Create Custom Service</CreateButtonLabel>
					</CreateButton>
				</>
			) : (
				<>
					<Field>
						<FieldLabel>Title</FieldLabel>
						<Input
							value={title}
							onChangeText={setTitle}
							placeholder="e.g. Netflix"
							placeholderTextColor={`${theme.text.tertiary}75`}
							autoFocus
						/>
					</Field>

					<Field>
						<FieldLabel>Category</FieldLabel>
						{categories.length > 0 ? (
							<CategoriesList>
								{categories.map((cat) => (
									<CategoryOption
										key={cat.id}
										$selected={selectedCategoryId === cat.id}
										onPress={() => setSelectedCategoryId(cat.id)}
									>
										<CategoryEmoji>{cat.emoji}</CategoryEmoji>
										<CategoryLabel $selected={selectedCategoryId === cat.id}>{cat.title}</CategoryLabel>
									</CategoryOption>
								))}
							</CategoriesList>
						) : (
							<PlaceholderText>No categories yet. Create one first.</PlaceholderText>
						)}
					</Field>

					<Field>
						<FieldLabel>Color</FieldLabel>
						<EmojiPreview onPress={() => setShowColorPicker(!showColorPicker)}>
							<View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: color }} />
							<PlaceholderText>{color}</PlaceholderText>
						</EmojiPreview>
						{showColorPicker && <ColorPicker value={color} onSelect={setColor} />}
					</Field>

					<SaveButton $disabled={!isValid} disabled={!isValid} onPress={save}>
						<SaveLabel>Save</SaveLabel>
					</SaveButton>
				</>
			)}
		</Container>
	);
};

export default AddServiceScreen;
