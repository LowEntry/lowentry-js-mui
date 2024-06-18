import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {LeUtils, STRING} from '@lowentry/utils';
import {Dialog as MuiDialog} from '@mui/material';
import './Dialog.less';


const Dialog = LeRed.memo(({onClose, children, 'aria-label':ariaLabel, ...props}) =>
{
	const ariaLabelId = LeRed.useMemo(() => 'lowentrymui_dialog_arialabel_' + LeUtils.uniqueId(), []);
	
	
	const onClosed = LeRed.useCallback((event, reason) =>
	{
		if(!STRING(reason).toLowerCase().includes('escape'))
		{
			// prevent closing when clicking on the backdrop, only allow escape-key closing
			return;
		}
		
		if(onClose)
		{
			onClose(event, reason);
		}
	}, [onClose]);
	
	
	return (<>
		<MuiDialog className="lowentry-mui--dialog" onClose={onClosed} aria-labelledby={ariaLabelId} {...props}>
			<span className="lowentry-mui--dialog--arialabel" id={ariaLabelId} style={{display:'none'}}>{ariaLabel ?? ''}</span>
			{children}
		</MuiDialog>
	</>);
});
export default Dialog;
