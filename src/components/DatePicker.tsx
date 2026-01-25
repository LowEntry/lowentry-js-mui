import React from 'react';
import {memo, useMemo, useCallback, useHistoryState} from '@lowentry/react-redux';
import {IS_ARRAY, STRING} from '@lowentry/utils';
import Dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {DatePicker as MuiDatePicker} from '@mui/x-date-pickers/DatePicker';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './DatePicker.less';

interface DatePickerTextFieldProps {
	dateFormat: string;
	value?: Dayjs.Dayjs | Date | string | number | null;
	className: string;
	ownerState?: {
		open?: boolean;
	};
	InputProps?: {
		endAdornment?: React.ReactNode;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

// Type guard for React elements
const isReactElement = (val: unknown): val is React.ReactElement => 
{
	return React.isValidElement(val);
};

const DatePickerTextField = memo(({dateFormat, value, className, ownerState, ...props}: DatePickerTextFieldProps) => 
{
	const onClick = useMemo(() => 
	{
		if (ownerState?.open) 
		{
			return undefined;
		}
		
		const inputProps = props.InputProps;
		if (!inputProps?.endAdornment) 
		{
			return null;
		}
		const endAdornment = inputProps.endAdornment;
		if (!isReactElement(endAdornment)) 
		{
			return null;
		}
		
		let propsLoop: unknown = endAdornment.props;
		while (propsLoop && typeof propsLoop === 'object') 
		{
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Dynamic props traversal
			const recordLoop = propsLoop as Record<string, unknown>;
			if ('onClick' in recordLoop && typeof recordLoop.onClick === 'function') 
			{
				// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Dynamic event handler extraction
				return recordLoop.onClick as React.MouseEventHandler<HTMLButtonElement>;
			}
			if ('children' in recordLoop && recordLoop.children) 
			{
				propsLoop = recordLoop.children;
				continue;
			}
			if (IS_ARRAY(propsLoop)) 
			{
				let continueLoop = false;
				for (const propsLoopItem of propsLoop) 
				{
					if (isReactElement(propsLoopItem)) 
					{
						const itemProps = propsLoopItem.props;
						if (itemProps && typeof itemProps === 'object') 
						{
							propsLoop = itemProps;
							continueLoop = true;
						}
					}
				}
				if (continueLoop) 
				{
					continue;
				}
			}
			if (isReactElement(propsLoop)) 
			{
				const nextProps = propsLoop.props;
				if (nextProps && typeof nextProps === 'object') 
				{
					propsLoop = nextProps;
				}
				else 
				{
					break;
				}
			}
			else 
			{
				break;
			}
		}
		return null;
	}, [ownerState, props.InputProps]);

	const onSelect = useCallback((event: React.SyntheticEvent<HTMLElement>) => 
	{
		const target = event.target;
		if (target && target instanceof HTMLInputElement) 
		{
			target.selectionStart = target.selectionEnd;
		}
		event.preventDefault();
	}, []);

	const inputProps = props.InputProps ?? {};
	
	const formattedValue = useMemo(() => 
	{
		if (value === null || value === undefined) 
		{
			return '';
		}
		return Dayjs(value).format(STRING(dateFormat));
	}, [value, dateFormat]);

	return (
		<Button variant="outlined" onClick={onClick ?? undefined}>
			<TextField
				{...props}
				className={'lowentry-mui--date-picker--textfield ' + (STRING(className) ?? '')}
				variant="outlined"
				value={formattedValue}
				// MUI's TextField InputProps has complex typing, use type assertion for compatibility
				 
				InputProps={{
					...inputProps,
					readOnly: true,
					endAdornment: null,
					onSelect: onSelect,
					onSelectCapture: onSelect,
					onMouseDown: onSelect,
					onTouchStart: onSelect,
					onTouchMove: onSelect,
				} as Record<string, unknown>}
			/>
		</Button>
	);
});

export interface DatePickerProps {
	value?: Dayjs.Dayjs | Date | string | null;
	dateFormat?: string;
	onChange?: (value: Dayjs.Dayjs | null) => void;
	className?: string;
	children?: React.ReactNode;
	[key: string]: unknown;
}

export const DatePicker = memo(({value, dateFormat, onChange, className, children, ...props}: DatePickerProps) => 
{
	const textFieldProps = useMemo(() => 
	{
		if (!dateFormat) 
		{
			return {dateFormat: 'ddd, D MMM YYYY'};
		}
		return {dateFormat};
	}, [dateFormat]);

	const [datepickerOpen, openDatepicker, closeDatepicker] = useHistoryState(false);

	const onChanged = useCallback(
		(value: Dayjs.Dayjs | null) => 
		{
			if (onChange) 
			{
				onChange(value);
			}
		},
		[onChange],
	);

	return (
		<Stack
			className={'lowentry-mui--date-picker ' + (className ?? '')}
			direction="row"
			justifyContent="space-between"
			spacing={1}
			{...props}
		>
			<Button
				className="lowentry-mui--date-picker--arrow-button"
				variant="text"
				color="primary"
				onClick={() => onChanged(Dayjs(value).subtract(1, 'day'))}
			>
				<ArrowBackIosNewIcon />
			</Button>
			<MuiDatePicker
				open={datepickerOpen}
				onOpen={openDatepicker}
				onClose={closeDatepicker}
				showDaysOutsideCurrentMonth={true}
				views={['day']}
				format="YYYY-MM-DD"
				enableAccessibleFieldDOMStructure={false}
				label=""
				value={value ? Dayjs(value) : null}
				onChange={onChanged}
				slots={{
					 
					textField: DatePickerTextField as React.ElementType,
					toolbar: () => null,
				}}
				// MUI's DatePicker slotProps has complex internal typing that doesn't recognize custom component props
				// We use type assertions here to pass our custom dateFormat prop through MUI's type system
				slotProps={{
					textField: {
						dateFormat: textFieldProps.dateFormat,
						 
					} as Record<string, unknown>,
				}}
			/>
			<Button
				className="lowentry-mui--date-picker--arrow-button"
				variant="text"
				color="primary"
				onClick={() => onChanged(Dayjs(value).add(1, 'day'))}
			>
				<ArrowForwardIosIcon />
			</Button>
			{children}
		</Stack>
	);
});

export default DatePicker;
