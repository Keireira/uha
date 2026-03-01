import React, { useMemo } from 'react';
import { Pressable } from 'react-native';
import SquircleMask from '@assets/masks/squircle.svg.tsx';
import { DotWrapper, Dot, Star, Glow, Ray } from './animated-star.styles';
import useStarAnimations from './use-star-animations';
import type { Props } from './animated-star.d';

const STAR_SIZE = 64;
const RAY_SCALE_VARIANTS = [1.4, 1.65, 1.9];
const RAY_ANGLES = [0, 35, 72, 108, 145, 170];
const HIT_SLOP = { top: 18, bottom: 18, left: 18, right: 18 };

const AnimatedStar = ({ logo, dotSize, position, isActive, onPress }: Props) => {
	const animations = useStarAnimations(isActive);
	const glowRadius = isActive ? (STAR_SIZE / 2) * 1.2 : dotSize * 1.2;

	const rays = useMemo(
		() =>
			RAY_ANGLES.map((angle, index) => ({
				angle,
				length: glowRadius * RAY_SCALE_VARIANTS[index % 3],
				thickness: isActive ? 1.5 : 1
			})),
		[glowRadius, isActive]
	);

	const dotPosition = {
		left: position.x - dotSize / 2,
		top: position.y - dotSize / 2
	};

	const starPosition = {
		left: position.x - STAR_SIZE / 2,
		top: position.y - STAR_SIZE / 2
	};

	const glowPosition = {
		left: position.x - glowRadius,
		top: position.y - glowRadius,
		width: glowRadius * 2,
		height: glowRadius * 2
	};

	return (
		<>
			<DotWrapper hitSlop={HIT_SLOP} style={dotPosition} onPress={onPress}>
				<Dot $color={logo.tint} style={{ width: dotSize, height: dotSize }} />
			</DotWrapper>

			<Star style={[starPosition, animations.pulse]}>
				<Pressable hitSlop={HIT_SLOP} onPress={onPress}>
					<SquircleMask link={logo.source} size={STAR_SIZE} />
				</Pressable>
			</Star>

			<Glow style={[glowPosition, animations.glow]}>
				{rays.map(({ angle, length, thickness }) => (
					<Ray
						key={angle}
						$color={logo.tint}
						style={{
							width: length * 2,
							height: thickness,
							borderRadius: thickness,
							transform: [{ rotate: `${angle}deg` }]
						}}
					/>
				))}
			</Glow>
		</>
	);
};

export default AnimatedStar;
