import React from 'react';
import {memo, useCallback} from '@lowentry/react-redux';
import Stack, {StackProps} from '@mui/material/Stack';

export interface SubmittableProps extends StackProps
{
	onSubmit?: (event: React.FormEvent) => void;
	disabled?: boolean | (() => boolean);
	sx?: React.CSSProperties;
	children?: React.ReactNode;
}

export const Submittable = memo(({onSubmit, disabled, sx, children, ...props}: SubmittableProps) =>
{
	const handleSubmit = useCallback(
		(event: React.FormEvent) =>
		{
			try
			{
				event.preventDefault();
			}
			catch
			{
				// ignore
			}

			if (disabled)
			{
				if (!(typeof disabled === 'function') || disabled())
				{
					return;
				}
			}

			if (onSubmit)
			{
				onSubmit(event);
			}
		},
		[onSubmit, disabled],
	);

	return (
		<form style={sx} onSubmit={handleSubmit}>
			<Stack {...props}>{children}</Stack>
		</form>
	);
});

export default Submittable;
