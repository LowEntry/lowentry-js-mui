import React from 'react';
import {memo, useCallback} from '@lowentry/react-redux';
import MuiTextField, {TextFieldProps as MuiTextFieldProps} from '@mui/material/TextField';
import './TextField.less';

export type TextFieldProps = MuiTextFieldProps & {
	onClick?: (event: React.MouseEvent) => void;
};

export const TextField = memo(({className, onClick, children, ...props}: TextFieldProps) =>
{
	const onClicked = useCallback(
		(event: React.MouseEvent) =>
		{
			try
			{
				event.stopPropagation();
			}
			catch
			{
				// ignore
			}

			if (onClick)
			{
				onClick(event);
			}
		},
		[onClick],
	);

	return (
		<MuiTextField
			className={'lowentry-mui--textfield ' + (className ?? '')}
			autoComplete="off"
			onClick={onClicked}
			{...props}
		>
			{children}
		</MuiTextField>
	);
});

export default TextField;
