import React from 'react';
import {Stack} from '@mui/material';


export const Submittable = LeRed.memo(({onSubmit, disabled, sx, children, ...props}) =>
{
	const handleSubmit = LeRed.useCallback((event) =>
	{
		try
		{
			event.preventDefault();
		}
		catch(e)
		{
		}
		
		if(disabled)
		{
			if(!(typeof disabled === 'function') || disabled())
			{
				return;
			}
		}
		
		if(onSubmit)
		{
			onSubmit(event);
		}
	}, [onSubmit, disabled]);
	
	
	return (<>
		<form style={sx ?? {}} onSubmit={handleSubmit}>
			<Stack {...props}>
				{children}
			</Stack>
		</form>
	</>);
});
