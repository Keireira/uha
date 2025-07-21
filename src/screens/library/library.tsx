import React, { useState } from 'react';
import { useScrollDirection } from '@hooks';
import { useTranslation } from 'react-i18next';

import HeaderLink from './header-link';
import { Wrapper, TextInput } from '@ui';
import { PaymentPreviews } from './payments';
import { ServicePreviews } from './services';
import { CategoryPreviews } from './categories';
import Root, { Section } from './library.styles';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type Props = React.PropsWithChildren<{
	title: string;
}>;

const SectionBlock = ({ children, title }: Props) => {
	return (
		<Section>
			<HeaderLink title={title} />
			<MaskedView
				style={{ marginLeft: -12, marginRight: -12 }}
				maskElement={
					<LinearGradient
						colors={['transparent', 'black', 'black', 'transparent']}
						locations={[0, 0.04, 0.96, 1]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={{ flex: 1 }}
					/>
				}
			>
				{children}
			</MaskedView>
		</Section>
	);
};

const LibraryScreen = () => {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');
	const handleScroll = useScrollDirection();

	return (
		<Wrapper as={Root} onScroll={handleScroll}>
			<TextInput leadingIcon="search" placeholder={t('library.search')} value={search} onChangeText={setSearch} />

			<SectionBlock title="Categories">
				<CategoryPreviews />
			</SectionBlock>

			<SectionBlock title="Services (apps)">
				<ServicePreviews />
			</SectionBlock>

			<SectionBlock title="Payment methods">
				<PaymentPreviews />
			</SectionBlock>
		</Wrapper>
	);
};

export default LibraryScreen;
