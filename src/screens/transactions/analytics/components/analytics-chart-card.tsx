import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { ChartCard, ChartFrame, ChartCenterLabel, ChartTotal } from '../analytics-sheet.styles';

import type { ChartDatumT } from '../analytics.d';

const SIZE = 256;
const CENTER = SIZE / 2;
const RADIUS = 86;
const STROKE_WIDTH = 32;
const MAX_GAP_DEGREES = 0;

type Props = {
	data: ChartDatumT[];
	total: string;
	onPressDatum: (id: string) => void;
};

const polarToCartesian = (angle: number) => {
	const radians = ((angle - 90) * Math.PI) / 180;

	return {
		x: CENTER + RADIUS * Math.cos(radians),
		y: CENTER + RADIUS * Math.sin(radians)
	};
};

const describeArc = (startAngle: number, endAngle: number): string => {
	const start = polarToCartesian(startAngle);
	const end = polarToCartesian(endAngle);
	const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

	return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

const AnalyticsChartCard = ({ data, total, onPressDatum }: Props) => {
	const centerLabel = () => (
		<ChartCenterLabel>
			<ChartTotal numberOfLines={1} adjustsFontSizeToFit>
				{total}
			</ChartTotal>
		</ChartCenterLabel>
	);

	const totalValue = data.reduce((acc, item) => acc + item.value, 0);
	let cursor = 0;

	return (
		<ChartCard>
			<ChartFrame>
				{data.length > 0 && totalValue > 0 && (
					<Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
						{data.length === 1 && (
							<Circle
								cx={CENTER}
								cy={CENTER}
								r={RADIUS}
								stroke={data[0].color}
								strokeWidth={STROKE_WIDTH}
								fill="none"
								onPress={() => onPressDatum(data[0].id)}
							/>
						)}

						{data.map((item) => {
							if (data.length === 1) return null;

							const angle = (item.value / totalValue) * 360;
							const gap = Math.min(MAX_GAP_DEGREES, angle * 0.45);
							const startAngle = cursor + gap / 2;
							const endAngle = cursor + angle - gap / 2;
							cursor += angle;

							if (endAngle <= startAngle) return null;

							return (
								<Path
									key={item.id}
									d={describeArc(startAngle, endAngle)}
									stroke={item.color}
									strokeWidth={STROKE_WIDTH}
									strokeLinecap="round"
									fill="none"
									onPress={() => onPressDatum(item.id)}
								/>
							);
						})}
					</Svg>
				)}

				{centerLabel()}
			</ChartFrame>
		</ChartCard>
	);
};

export default AnalyticsChartCard;
