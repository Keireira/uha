import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LogoView } from '@ui';
import { SymbolView } from 'expo-symbols';
import { ColorPicker } from '@elements';
import { colorMix, isTextDark } from '@lib/color-utils';
import useAddService from './use-add-service';
import {
	Container,
	Header,
	Title,
	CloseGlass,
	CloseInner,
	Preview,
	PreviewInitial,
	NameInput,
	Main,
	Section,
	Caption,
	CategoryOption,
	CategoryEmoji,
	CategoryLabel,
	CategoriesList,
	PlaceholderText,
	SearchInput,
	ResultItem,
	ResultTitle,
	ResultSubtitle,
	CreateButton,
	CreateButtonLabel,
	Divider,
	SaveButton,
	SaveLabel
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
		categories,
		filteredResults,
		isValid,
		switchToCreate,
		save
	} = useAddService();

	const dark = useMemo(() => isTextDark(color), [color]);
	const previewBg = useMemo(() => colorMix(color, theme.background.default, 0.5), [color, theme.background.default]);
	const iconColor = mode === 'create' ? (dark ? '#333333' : '#ffffff') : theme.text.tertiary;
	const initial = title.trim().charAt(0).toUpperCase() || '?';

	if (mode === 'search') {
		return (
			<Container
				contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}
			>
				<Header>
					<Title $dark={true}>New Service</Title>
					<CloseGlass isInteractive>
						<CloseInner onPress={() => router.back()} hitSlop={10}>
							<SymbolView name="xmark" size={16} weight="bold" tintColor={theme.text.tertiary} />
						</CloseInner>
					</CloseGlass>
				</Header>

				<SearchInput
					value={search}
					onChangeText={setSearch}
					placeholder="Search existing services..."
					placeholderTextColor={`${theme.text.tertiary}75`}
					autoFocus
				/>

				{filteredResults.length > 0 && (
					<View>
						{filteredResults.map((service) => (
							<ResultItem key={service.id}>
								<LogoView name={service.title} emoji={undefined} color={service.color} size={40} />
								<View>
									<ResultTitle>{service.title}</ResultTitle>
									<ResultSubtitle>{service.slug}</ResultSubtitle>
								</View>
							</ResultItem>
						))}
					</View>
				)}

				<Divider />

				<CreateButton onPress={switchToCreate}>
					<CreateButtonLabel>+ Create Custom Service</CreateButtonLabel>
				</CreateButton>
			</Container>
		);
	}

	return (
		<Container
			style={{ backgroundColor: color }}
			contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, gap: 24, paddingBottom: insets.bottom + 24 }}
		>
			<Header>
				<Title $dark={dark}>New Service</Title>
				<CloseGlass isInteractive>
					<CloseInner onPress={() => router.back()} hitSlop={10}>
						<SymbolView name="xmark" size={16} weight="bold" tintColor={iconColor} />
					</CloseInner>
				</CloseGlass>
			</Header>

			<Preview $bg={previewBg}>
				<PreviewInitial $dark={dark}>{initial}</PreviewInitial>
			</Preview>

			<NameInput
				$dark={dark}
				value={title}
				onChangeText={setTitle}
				placeholder="Service name"
				placeholderTextColor={dark ? 'rgba(51,51,51,0.35)' : 'rgba(255,255,255,0.35)'}
				autoFocus
			/>

			<Main>
				<Section>
					<Caption $dark={dark}>Category</Caption>
					{categories.length > 0 ? (
						<CategoriesList>
							{categories.map((cat) => (
								<CategoryOption
									key={cat.id}
									$selected={selectedCategoryId === cat.id}
									onPress={() => setSelectedCategoryId(cat.id)}
								>
									<CategoryEmoji>{cat.emoji}</CategoryEmoji>
									<CategoryLabel $dark={dark} $selected={selectedCategoryId === cat.id}>
										{cat.title}
									</CategoryLabel>
								</CategoryOption>
							))}
						</CategoriesList>
					) : (
						<PlaceholderText $dark={dark}>No categories yet. Create one first.</PlaceholderText>
					)}
				</Section>

				<Section>
					<Caption $dark={dark}>Support Color</Caption>
					<ColorPicker value={color} onSelect={setColor} />
				</Section>
			</Main>

			<SaveButton $disabled={!isValid} disabled={!isValid} onPress={save}>
				<SaveLabel $dark={dark}>Create</SaveLabel>
			</SaveButton>
		</Container>
	);
};

export default AddServiceScreen;
