import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {Avatar as MuiAvatar} from '@mui/material';


const Avatar = LeRed.memo(({src, slotProps, retryOptions, children, ...props}) =>
{
	const [imgSrc, onImgError] = LeRed.useRetryingImageUrl(src, retryOptions);
	
	
	const onError = LeRed.useCallback((...args) =>
	{
		onImgError(...args);
		
		if(slotProps?.img?.onError)
		{
			slotProps.img.onError(...args);
		}
	}, [onImgError, slotProps?.img?.onError]);
	
	
	return (<>
		<MuiAvatar src={imgSrc} slotProps={{...(slotProps ?? {}), img:{referrerPolicy:'no-referrer', ...(slotProps?.img ?? {}), onError:onError}}} {...props}>
			{children}
		</MuiAvatar>
	</>);
});
export default Avatar;
