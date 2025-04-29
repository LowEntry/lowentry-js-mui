import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {Backdrop, CircularProgress} from '@mui/material';
import './LoadingSpinner.less';


let loadingSpinnerCount = {};
let loadingSpinnerCountNonTransparent = 0;

const LoadingSpinnerGrab = ({type}) =>
{
	loadingSpinnerCount[type] = (loadingSpinnerCount[type] || 0) + 1;
	if(loadingSpinnerCount[type] === 1)
	{
		LeRed.trigger('lowentry-mui--loading-spinner--' + type);
	}
};

const LoadingSpinnerRelease = ({type}) =>
{
	loadingSpinnerCount[type] = (loadingSpinnerCount[type] || 1) - 1;
	if(loadingSpinnerCount[type] === 0)
	{
		LeRed.trigger('lowentry-mui--loading-spinner--' + type);
	}
};


export const LoadingSpinner = LeRed.memo(({type}) =>
{
	LeRed.useEffect(() =>
	{
		LoadingSpinnerGrab({type});
		return () => LoadingSpinnerRelease({type});
	}, [type]);
	
	return null;
});


export const LoadingSpinnerWidget = LeRed.memo(({type, className, sx, children, ...props}) =>
{
	LeRed.useTriggerable('lowentry-mui--loading-spinner--' + type);
	
	return (<>
		<Backdrop className={'lowentry-mui--loading-spinner lowentry-mui--loading-spinner--' + type + ' ' + (className ?? '')} sx={{zIndex:(theme) => theme.zIndex.drawer + 1, ...(sx ?? {})}} open={(loadingSpinnerCount[type] || 0) > 0} {...props}>
			<CircularProgress color="inherit" size="min(120px,30vw)"/>
		</Backdrop>
	</>);
});
