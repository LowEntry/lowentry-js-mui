import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import './MuiRoot.css';


const MuiRoot = LeRed.memo(({theme, className, children, ...props}) =>
{
	return (<>
		<CssBaseline/>
		<ThemeProvider theme={theme}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className={'lowentry-mui--mui-root ' + (className ?? '')} {...props}>
					{children}
				</div>
			</LocalizationProvider>
		</ThemeProvider>
	</>);
});
export default MuiRoot;
