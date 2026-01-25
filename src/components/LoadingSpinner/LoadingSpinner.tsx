import {memo, useEffect, trigger, useTriggerable} from '@lowentry/react-redux';
import Backdrop, {BackdropProps} from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {Theme} from '@mui/material/styles';
import './LoadingSpinner.less';

const loadingSpinnerCount: Record<string, number> = {};

const LoadingSpinnerGrab = ({type }: {type: string}): void => 
{
	loadingSpinnerCount[type] = (loadingSpinnerCount[type] || 0) + 1;
	if (loadingSpinnerCount[type] === 1) 
	{
		trigger('lowentry-mui--loading-spinner--' + type, {});
	}
};

const LoadingSpinnerRelease = ({type }: {type: string}): void => 
{
	loadingSpinnerCount[type] = (loadingSpinnerCount[type] || 1) - 1;
	if (loadingSpinnerCount[type] === 0) 
	{
		trigger('lowentry-mui--loading-spinner--' + type, {});
	}
};

export const LoadingSpinner = memo(({type }: {type: string}) => 
{
	useEffect(() => 
	{
		LoadingSpinnerGrab({type});
		return (): void => LoadingSpinnerRelease({type});
	}, [type]);

	return null;
});

export interface LoadingSpinnerWidgetProps extends Omit<BackdropProps, 'open'> {
	type: string;
}

export const LoadingSpinnerWidget = memo(({type, className, sx, children, ...props}: LoadingSpinnerWidgetProps) => 
{
	useTriggerable('lowentry-mui--loading-spinner--' + type);

	return (
		<Backdrop
			className={'lowentry-mui--loading-spinner lowentry-mui--loading-spinner--' + type + ' ' + (className ?? '')}
			sx={{zIndex: (theme: Theme) => theme.zIndex.drawer + 1, ...(sx ?? {})}}
			open={(loadingSpinnerCount[type] || 0) > 0}
			{...props}
		>
			<CircularProgress color="inherit" size="min(120px,30vw)" />
			{children}
		</Backdrop>
	);
});
