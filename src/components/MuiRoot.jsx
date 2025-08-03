import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import './MuiRoot.less';


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
