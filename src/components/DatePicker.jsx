import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {IS_ARRAY} from '@lowentry/utils';
import Dayjs from 'dayjs';
import {Button, Stack, TextField} from '@mui/material';
import {DatePicker as MuiDatePicker} from '@mui/x-date-pickers';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './DatePicker.less';


const DatePickerTextField = LeRed.memo(({dateFormat, value, className, children, ...props}) =>
{
	const onClick = LeRed.useMemo(() =>
	{
		if(props?.ownerState?.open)
		{
			return null;
		}
		let propsLoop = props?.InputProps?.endAdornment?.props;
		while(propsLoop)
		{
			if(propsLoop.onClick)
			{
				return propsLoop.onClick;
			}
			if(propsLoop?.children)
			{
				propsLoop = propsLoop.children;
				continue;
			}
			if(IS_ARRAY(propsLoop))
			{
				let continueLoop = false;
				for(const propsLoopItem of propsLoop)
				{
					if(propsLoopItem?.props)
					{
						propsLoop = propsLoopItem.props;
						continueLoop = true;
					}
				}
				if(continueLoop)
				{
					continue;
				}
			}
			propsLoop = propsLoop?.props;
		}
		return null;
	}, [props?.ownerState?.open, props?.InputProps?.endAdornment?.props]);
	
	
	const onSelect = LeRed.useCallback((event) =>
	{
		event.target.selectionStart = event.target.selectionEnd;
		event.preventDefault();
	}, []);
	
	
	return (<>
		<Button variant="outlined" onClick={onClick}>
			<TextField {...props} className={'lowentry-mui--date-picker--textfield ' + (className ?? '')} variant="outlined" value={Dayjs(value).format(dateFormat)} InputProps={{...(props.InputProps ?? {}), readOnly:true, endAdornment:null, onSelect:onSelect, onSelectCapture:onSelect, onMouseDown:onSelect, onTouchStart:onSelect, onTouchMove:onSelect}}>{children}</TextField>
		</Button>
	</>);
});


const DatePicker = LeRed.memo(({value, dateFormat, onChange, className, children, ...props}) =>
{
	/** @type {*} */
	const textFieldProps = LeRed.useMemo(() =>
	{
		if(!dateFormat)
		{
			return {dateFormat:'ddd, D MMM YYYY'};
		}
		return {dateFormat};
	}, [dateFormat]);
	
	const [datepickerOpen, openDatepicker, closeDatepicker] = LeRed.useHistoryState(false);
	
	
	const onChanged = LeRed.useCallback((...args) =>
	{
		if(onChange)
		{
			onChange(...args);
		}
	}, [onChange]);
	
	
	return (<>
		<Stack className={'lowentry-mui--date-picker ' + (className ?? '')} direction="row" justifyContent="space-between" spacing={1} {...props}>
			<Button className="lowentry-mui--date-picker--arrow-button" variant="text" color="primary" onClick={() => onChanged(Dayjs(value).subtract(1, 'day'))}><ArrowBackIosNewIcon/></Button>
			<MuiDatePicker
				open={datepickerOpen}
				onOpen={openDatepicker}
				onClose={closeDatepicker}
				showDaysOutsideCurrentMonth={true}
				views={['day']}
				format="YYYY-MM-DD"
				label=""
				value={value}
				onChange={onChanged}
				slots={{
					textField:DatePickerTextField,
					toolbar:  (props) => null,
				}}
				slotProps={{
					textField:textFieldProps,
				}}
			/>
			<Button className="lowentry-mui--date-picker--arrow-button" variant="text" color="primary" onClick={() => onChanged(Dayjs(value).add(1, 'day'))}><ArrowForwardIosIcon/></Button>
		</Stack>
	</>);
});
export default DatePicker;
