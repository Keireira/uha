import React from 'react';
import { Text, Wrapper } from '@ui';
import { ImageBackground } from 'expo-image';

const SearchScreen = () => {
	return (
		<ImageBackground
			source="https://kagi.com/proxy/latest?c=LsHiRSPxhD29sXqLhdI0j1EsQ98nx-H1fY71FBuiA4nOupMsekU5RIg0fMl8ra50j6UDRta_KucKHFp4BZ5T2_YjERFEkTya6SMhHymS1ePnTUow1OMqfRvF6wNdTzLfkA08ZPkSUk3s2VCvWR6rZIPdNxR3PcoLiuofneVXf2wmUTIOk92SLund6vvGAHrp"
			style={{ width: '100%', height: '100%' }}
		>
			<Wrapper>
				<Text style={{ color: 'white' }}>SEARCH BLOCK</Text>
			</Wrapper>
		</ImageBackground>
	);
};

export default SearchScreen;
