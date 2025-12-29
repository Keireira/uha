import React from 'react';

import { SmallText, LargeText, H3, LogoView } from '@ui';
import Root, { LogoWrap, TextRow, TextWrap } from './transaction-card.styles';

const TransactionCard = () => {
	return (
		<Root>
			<LogoWrap>
				<LogoView
					logoId={77}
					logoUrl="https://avatars.yandex.net/get-music-content/6021799/18020bcb.a.3755515-2/m1000x1000"
					emoji="🚸"
					name="App Name"
					size={48}
					color="#afa444"
				/>
			</LogoWrap>

			<TextWrap>
				<TextRow>
					<H3>Some App Name</H3>

					<LargeText>$100.00</LargeText>
				</TextRow>

				<TextRow>
					<SmallText>Network-something</SmallText>

					<SmallText>Altyn *9197</SmallText>
				</TextRow>
			</TextWrap>
		</Root>
	);
};

export default React.memo(TransactionCard);
