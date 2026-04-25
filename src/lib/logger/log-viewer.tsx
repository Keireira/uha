import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Share, StyleSheet, type ListRenderItem } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { GlassView } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import logger, { type LogEntry, type LogLevel } from './logger';

const LEVEL_COLORS: Record<LogLevel, string> = {
	log: '#8e8e93',
	warn: '#ffd60a',
	error: '#ff453a'
};

const formatTime = (ts: number) => format(ts, 'dd LLL HH:mm:ss.SSS');

const Container = styled.View<{ $pt: number }>`
	flex: 1;
	background-color: ${({ theme }) => theme.background.default};
	padding-top: ${({ $pt }) => $pt}px;
`;

const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding-horizontal: 16px;
	padding-vertical: 12px;
`;

const HeaderTitle = styled.Text`
	font-size: 24px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.primary};
`;

const ActionsGlass = styled(GlassView)`
	flex-direction: row;
	align-items: center;
	border-radius: 42px;
	padding-horizontal: 4px;
`;

const ActionBtn = styled.Pressable`
	align-items: center;
	justify-content: center;
	border-radius: 14px;
	padding-vertical: 12px;
	padding-horizontal: 16px;
`;

const TabBar = styled(GlassView)<{ $pb: number }>`
	flex-direction: row;
	align-self: center;
	border-radius: 42px;
	padding: 4px;
	margin-bottom: ${({ $pb }) => $pb}px;
	margin-top: 8px;
`;

const Tab = styled.Pressable<{ $active?: boolean }>`
	padding: 10px 20px;
	border-radius: 38px;
	background-color: ${({ theme, $active }) => ($active ? theme.surface.default : 'transparent')};
`;

const TabText = styled.Text<{ $active?: boolean }>`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.tertiary)};
`;

const Row = styled.View`
	padding-horizontal: 16px;
	padding-vertical: 8px;
	border-bottom-width: ${StyleSheet.hairlineWidth}px;
	border-bottom-color: ${({ theme }) => theme.border.subtle};
`;

const RowHeader = styled.View`
	flex-direction: row;
	align-items: flex-start;
	gap: 8px;
	margin-top: 4px;
`;

const LevelText = styled.Text<{ $color: string }>`
	font-size: 11px;
	font-weight: 700;
	font-family: Menlo;
	color: ${({ $color }) => $color};
`;

const TimeText = styled.Text`
	font-size: 11px;
	font-family: Menlo;
	color: ${({ theme }) => theme.accents.cyan};
`;

const MessageText = styled.Text`
	font-size: 13px;
	font-family: Menlo;
	color: ${({ theme }) => theme.text.secondary};
	line-height: 18px;
`;

/* ── components ── */

const MessageScroll = styled.ScrollView.attrs({
	horizontal: true,
	showsHorizontalScrollIndicator: false
})``;

const LogRow = React.memo(({ item }: { item: LogEntry }) => (
	<Row>
		<TimeText>{formatTime(item.timestamp)}</TimeText>
		<MessageScroll>
			<RowHeader>
				<LevelText $color={LEVEL_COLORS[item.level]}>{item.level.toUpperCase()}</LevelText>
				<MessageText selectable>{item.message}</MessageText>
			</RowHeader>
		</MessageScroll>
	</Row>
));

const LogViewer = ({ onClose }: { onClose: () => void }) => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [entries, setEntries] = useState<LogEntry[]>(logger.getEntries);
	const [filter, setFilter] = useState<LogLevel | null>(null);
	const listRef = useRef<FlatList>(null);

	useEffect(() => {
		return logger.subscribe(() => {
			setEntries([...logger.getEntries()]);
		});
	}, []);

	const filtered = filter ? entries.filter((e) => e.level === filter) : entries;

	const handleShare = useCallback(async () => {
		const text = filtered.map((e) => `[${formatTime(e.timestamp)}] ${e.level.toUpperCase()}: ${e.message}`).join('\n');
		await Share.share({ message: text });
	}, [filtered]);

	const handleClear = useCallback(() => {
		logger.clear();
		setEntries([]);
	}, []);

	const renderItem: ListRenderItem<LogEntry> = useCallback(({ item }) => <LogRow item={item} />, []);

	const keyExtractor = useCallback((item: LogEntry) => String(item.id), []);

	return (
		<Container $pt={insets.top}>
			<Header>
				<HeaderTitle>Logs ({filtered.length})</HeaderTitle>
				<ActionsGlass isInteractive>
					<ActionBtn onPress={handleShare}>
						<SymbolView name="square.and.arrow.up" size={22} weight="semibold" tintColor={theme.text.primary} />
					</ActionBtn>
					<ActionBtn onPress={handleClear}>
						<SymbolView name="trash" size={22} weight="semibold" tintColor={theme.semantic.error} />
					</ActionBtn>
					<ActionBtn onPress={onClose}>
						<SymbolView name="xmark" size={20} weight="bold" tintColor={theme.text.primary} />
					</ActionBtn>
				</ActionsGlass>
			</Header>

			<FlatList
				ref={listRef}
				data={filtered}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingTop: insets.bottom + 16, paddingBottom: 16 }}
				initialNumToRender={30}
				maxToRenderPerBatch={20}
				inverted
			/>

			<TabBar $pb={insets.bottom + 12}>
				{([null, 'log', 'warn', 'error'] as const).map((level) => (
					<Tab key={String(level)} $active={filter === level} onPress={() => setFilter(level)}>
						<TabText $active={filter === level}>
							{level ? level.charAt(0).toUpperCase() + level.slice(1) : 'All'}
						</TabText>
					</Tab>
				))}
			</TabBar>
		</Container>
	);
};

export default LogViewer;
