import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {TextField as MuiTextField} from '@mui/material';
import './TextField.less';


const TextField = LeRed.memo(({className, onClick, children, ...props}) =>
{
	const onClicked = LeRed.useCallback((event) =>
	{
		try
		{
			event.stopPropagation();
		}
		catch(e)
		{
		}
		
		if(onClick)
		{
			onClick(event);
		}
	}, [onClick]);
	
	
	return (<>
		<MuiTextField className={'lowentry-mui--textfield ' + (className ?? '')} autoComplete="off" onClick={onClicked} {...props}>{children}</MuiTextField>
	</>);
});
export default TextField;
