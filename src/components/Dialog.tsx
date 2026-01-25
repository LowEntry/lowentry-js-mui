import React from 'react';
import {memo, useMemo, useCallback} from '@lowentry/react-redux';
import {LeUtils, STRING} from '@lowentry/utils';
import MuiDialog, {DialogProps as MuiDialogProps} from '@mui/material/Dialog';
import './Dialog.less';

export interface DialogProps extends Omit<MuiDialogProps, 'onClose'> {
	onClose?: (event: React.SyntheticEvent, reason: string) => void;
	children?: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'aria-label'?: string;
}

export const Dialog = memo(({onClose, children, 'aria-label': ariaLabel, open, ...props}: DialogProps) => 
{
	const ariaLabelId = useMemo(() => 'lowentrymui_dialog_arialabel_' + LeUtils.uniqueId(), []);

	const onClosed = useCallback(
		(event: React.SyntheticEvent, reason: string) => 
		{
			if (!STRING(reason).toLowerCase().includes('escape')) 
			{
				// prevent closing when clicking on the backdrop, only allow escape-key closing
				return;
			}

			if (onClose) 
			{
				onClose(event, reason);
			}
		},
		[onClose],
	);

	return (
		<MuiDialog className="lowentry-mui--dialog" onClose={onClosed} aria-labelledby={ariaLabelId} open={open ?? false} {...props}>
			<span className="lowentry-mui--dialog--arialabel" id={ariaLabelId} style={{display: 'none'}}>
				{ariaLabel ?? ''}
			</span>
			{children}
		</MuiDialog>
	);
});

export default Dialog;
