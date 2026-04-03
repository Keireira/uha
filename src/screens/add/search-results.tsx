import React, { useMemo, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { SymbolView } from 'expo-symbols';

import SquircleMask from '@assets/masks/squircle.svg.tsx';

import {
	Container,
	ResultsCount,
	SectionWrap,
	SectionLabel,
	SectionCard,
	SectionFooter,
	TopHitInner,
	TopHitInfo,
	TopHitName,
	TopHitDomain,
	RowInner,
	RowDivider,
	LogoGlass,
	LogoInner,
	LogoFallback,
	FallbackInitial,
	Info,
	ServiceName,
	Domain,
	BadgeGlass,
	BadgeInner,
	BadgeLabel,
	EmptyWrap,
	EmptyCard,
	EmptyInner,
	EmptyText,
	LoadingContainer
} from './search-results.styles';

import type { SearchResultT, SourceT } from '@api/soup/soup.d';

type Props = {
	results: SearchResultT[];
	loading: boolean;
	query: string;
};

const SOURCE_META = {
	local: { color: '#34C759', label: 'In your library' },
	brandfetch: { color: '#4A90D9', label: 'Brandfetch' },
	'logo.dev': { color: '#8E8E93', label: 'Logo.dev' }
} as const;

const FALLBACK_META = { color: '#8E8E93', label: 'Web' } as const;

const getInitials = (name: string) =>
	name
		.trim()
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join('');

/* ── Glass logo ──────────────────────────── */

const GlassLogo = ({ logoUrl, name, size }: { logoUrl: string; name: string; size: number }) => (
	<LogoGlass $size={size}>
		<LogoInner>
			{logoUrl ? (
				<SquircleMask size={size - 4} link={logoUrl} />
			) : (
				<LogoFallback>
					<FallbackInitial $size={size}>{getInitials(name) || '?'}</FallbackInitial>
				</LogoFallback>
			)}
		</LogoInner>
	</LogoGlass>
);

/* ── Source badge ─────────────────────────── */

const SourceBadge = ({ source }: { source: string }) => {
	const meta = SOURCE_META[source as SourceT] ?? FALLBACK_META;

	if (source === 'local') {
		return <SymbolView name="checkmark.seal.fill" size={20} tintColor={meta.color} />;
	}

	return (
		<BadgeGlass>
			<BadgeInner $color={meta.color}>
				<BadgeLabel $color={meta.color}>{meta.label}</BadgeLabel>
			</BadgeInner>
		</BadgeGlass>
	);
};

/* ── Top Hit ──────────────────────────────── */

const TopHitCard = ({ result, onPress }: { result: SearchResultT; onPress: () => void }) => {
	const domain = result.domains?.[0];

	return (
		<SectionWrap>
			<SectionLabel>Top Hit</SectionLabel>
			<SectionCard>
				<TopHitInner onPress={onPress}>
					<GlassLogo logoUrl={result.logo_url} name={result.name} size={56} />

					<TopHitInfo>
						<TopHitName numberOfLines={1}>{result.name}</TopHitName>
						{domain && <TopHitDomain numberOfLines={1}>{domain}</TopHitDomain>}
					</TopHitInfo>

					<SourceBadge source={result.source} />
				</TopHitInner>
			</SectionCard>
		</SectionWrap>
	);
};

/* ── Row ──────────────────────────────────── */

const ResultRow = ({ result, isLast, onPress }: { result: SearchResultT; isLast: boolean; onPress: () => void }) => {
	const domain = result.domains?.[0];

	return (
		<>
			<RowInner onPress={onPress}>
				<GlassLogo logoUrl={result.logo_url} name={result.name} size={44} />

				<Info>
					<ServiceName numberOfLines={1}>{result.name}</ServiceName>
					{domain && <Domain numberOfLines={1}>{domain}</Domain>}
				</Info>

				<SourceBadge source={result.source} />
			</RowInner>
			{!isLast && <RowDivider />}
		</>
	);
};

/* ── Section ──────────────────────────────── */

const ResultSection = ({
	label,
	footer,
	results,
	onPress
}: {
	label: string;
	footer?: string;
	results: SearchResultT[];
	onPress: (r: SearchResultT) => void;
}) => {
	if (results.length === 0) return null;

	return (
		<SectionWrap>
			<SectionLabel>{label}</SectionLabel>
			<SectionCard>
				{results.map((result, i) => (
					<ResultRow
						key={`${result.source}-${result.id}`}
						result={result}
						isLast={i === results.length - 1}
						onPress={() => onPress(result)}
					/>
				))}
			</SectionCard>
			{footer && <SectionFooter>{footer}</SectionFooter>}
		</SectionWrap>
	);
};

/* ── Main ─────────────────────────────────── */

const SearchResults = ({ results, loading, query }: Props) => {
	const router = useRouter();
	const theme = useTheme();

	const { topHit, localRest, onlineRest } = useMemo(() => {
		if (results.length === 0) return { topHit: null, localRest: [], onlineRest: [] };

		const [first, ...rest] = results;
		const local = rest.filter((r) => r.source === 'local');
		const online = rest.filter((r) => r.source !== 'local');

		return { topHit: first, localRest: local, onlineRest: online };
	}, [results]);

	const handlePress = useCallback(
		(result: SearchResultT) => {
			router.push({
				pathname: '/add-subscription',
				params: {
					service_id: result.id,
					service_name: result.name,
					service_logo: result.logo_url,
					service_source: result.source
				}
			});
		},
		[router]
	);

	if (loading && results.length === 0) {
		return (
			<LoadingContainer>
				<ActivityIndicator color={theme.text.tertiary} />
			</LoadingContainer>
		);
	}

	if (!loading && results.length === 0 && query.trim().length >= 2) {
		return (
			<EmptyWrap>
				<EmptyCard>
					<EmptyInner>
						<SymbolView name="magnifyingglass" size={32} tintColor={theme.text.tertiary} />
						<EmptyText>No services found</EmptyText>
					</EmptyInner>
				</EmptyCard>
			</EmptyWrap>
		);
	}

	const totalCount = results.length;

	return (
		<Container>
			{totalCount > 0 && <ResultsCount>{totalCount} results</ResultsCount>}

			{topHit && <TopHitCard result={topHit} onPress={() => handlePress(topHit)} />}

			<ResultSection label="Verified" results={localRest} onPress={handlePress} />

			<ResultSection
				label="External"
				footer="Found via third-party providers"
				results={onlineRest}
				onPress={handlePress}
			/>
		</Container>
	);
};

export default SearchResults;
