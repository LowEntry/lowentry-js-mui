import React from 'react';
import {memo} from '@lowentry/react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider, Theme} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import './MuiRoot.less';

export interface MuiRootProps {
	theme: Theme;
	className?: string;
	children?: React.ReactNode;
	[key: string]: unknown;
}

export const MuiRoot = memo(({theme, className, children, ...props}: MuiRootProps) => 
{
	return (
		<>
			<CssBaseline />
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<div className={'lowentry-mui--mui-root ' + (className ?? '')} {...props}>
						{children}
					</div>
				</LocalizationProvider>
			</ThemeProvider>
		</>
	);
});

export default MuiRoot;
