import React from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

import { useAccent } from '@hooks';
import { withAlpha } from '@lib/colors';

import {
	font,
	frame,
	padding,
	background,
	buttonStyle,
	glassEffect,
	lineLimit,
	onTapGesture,
	foregroundStyle,
	multilineTextAlignment,
	scrollContentBackground
} from '@expo/ui/swift-ui/modifiers';
import { WrapHStack } from '@modules/wrap-hstack';
import { Host, ScrollView, VStack, ZStack, Text, Image, Circle, Button } from '@expo/ui/swift-ui';

import type { SFSymbol } from 'expo-symbols';

const ITEMS = [
	{
		route: '/(tabs)/library/categories-list',
		icon: 'square.grid.2x2' satisfies SFSymbol,
		slug: 'categories'
	},
	{
		route: '/(tabs)/library/services-list',
		icon: 'building.2' satisfies SFSymbol,
		slug: 'services'
	},
	{
		route: '/(tabs)/library/payments-list',
		icon: 'creditcard' satisfies SFSymbol,
		slug: 'payments'
	},
	{
		route: '/(tabs)/library/subscriptions-list',
		icon: 'arrow.triangle.2.circlepath' satisfies SFSymbol,
		slug: 'subscriptions'
	}
] as const;

const useButtonsWidth = () => {
	const halfButtonWidth = (initialWindowMetrics?.frame.width ?? 400) / 2 - 26;
	const fullButtonWidth = halfButtonWidth * 2 + 13;

	const getWidth = (index: number, arrLength: number) => {
		const isLast = index === arrLength - 1;
		const isEven = index % 2 === 0;

		return isLast && isEven ? fullButtonWidth : halfButtonWidth;
	};

	return getWidth;
};

const LibraryScreen = () => {
	const theme = useTheme();
	const router = useRouter();
	const { t } = useTranslation();
	const settingAccent = useAccent();
	const getWidth = useButtonsWidth();

	return (
		<Host style={{ flex: 1 }}>
			<ScrollView
				showsIndicators={false}
				modifiers={[background(theme.background.default), scrollContentBackground('hidden')]}
			>
				<VStack alignment="leading">
					<Text
						modifiers={[
							padding({ horizontal: 20 }),
							frame({ alignment: 'leading' }),
							font({ size: 32, design: 'rounded', weight: 'bold' })
						]}
					>
						{t('library.title')}
					</Text>

					<WrapHStack spacing={12} lineSpacing={12} modifiers={[padding({ horizontal: 20, top: 16, bottom: 32 })]}>
						{ITEMS.map((item, index, arr) => {
							const goTo = () => router.push(item.route);

							return (
								<Button
									key={item.route}
									onPress={goTo}
									modifiers={[
										frame({
											alignment: 'topLeading',
											idealWidth: getWidth(index, arr.length)
										}),
										buttonStyle('borderless')
									]}
								>
									<VStack
										alignment="leading"
										spacing={12}
										modifiers={[
											padding({ vertical: 20, horizontal: 16 }),
											frame({ maxWidth: Number.POSITIVE_INFINITY, alignment: 'topLeading' }),
											glassEffect({
												glass: {
													variant: 'regular',
													interactive: true
												},
												shape: 'roundedRectangle',
												cornerRadius: 16
											}),
											onTapGesture(goTo)
										]}
									>
										<ZStack>
											<Circle
												modifiers={[frame({ width: 42, height: 42 }), foregroundStyle(withAlpha(settingAccent, 0.2))]}
											/>

											<Image systemName={item.icon} size={18} color={settingAccent} />
										</ZStack>

										<Text
											modifiers={[
												multilineTextAlignment('leading'),
												foregroundStyle(theme.text.primary),
												lineLimit(1, { reservesSpace: false }),
												font({ size: 16, design: 'rounded', weight: 'semibold' })
											]}
										>
											{t(`library.grid.${item.slug}.title`)}
										</Text>

										<Text
											modifiers={[
												multilineTextAlignment('leading'),
												lineLimit(2, { reservesSpace: true }),
												foregroundStyle(theme.text.secondary),
												font({ size: 12, design: 'rounded', weight: 'regular' })
											]}
										>
											{t(`library.grid.${item.slug}.description`)}
										</Text>
									</VStack>
								</Button>
							);
						})}
					</WrapHStack>
				</VStack>
			</ScrollView>
		</Host>
	);
};

export default LibraryScreen;
