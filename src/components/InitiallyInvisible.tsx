import React from 'react';
import {memo, useState, useEffect} from '@lowentry/react-redux';
import {LeUtils, INT_LAX} from '@lowentry/utils';

export interface InitiallyInvisibleProps extends React.HTMLAttributes<HTMLDivElement> {
	frames?: number;
	transition?: string;
	opacityKey?: unknown;
}

export const InitiallyInvisible = memo(
	({frames, transition, style, children, opacityKey, ...other}: InitiallyInvisibleProps) => 
	{
		const [opacity, setOpacity] = useState(0);

		useEffect(() => 
		{
			setOpacity(0);
			return LeUtils.setAnimationFrameTimeout(() => setOpacity(1), Math.max(opacityKey ? 2 : 0, INT_LAX(frames))).remove;
		}, [opacityKey, frames]);

		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					opacity,
					transition: opacity > 0 && transition ? 'opacity ' + transition : 'none',
					...(style ?? {}),
				}}
				{...other}
			>
				{children}
			</div>
		);
	},
);

export default InitiallyInvisible;
