import React from 'react';
import {STRING} from '@lowentry/utils';
import {Dialog} from '@mui/material';


export const Dialog = LeRed.memo(({onClose, children, ...props}) =>
{
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
		<Dialog onClose={onClosed} {...props}>
			{children}
		</Dialog>
	</>);
});
