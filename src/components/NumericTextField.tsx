import React from 'react';
import {memo, useCallback, useState, useEffect} from '@lowentry/react-redux';
import {FLOAT_LAX, INT_LAX_ANY, STRING} from '@lowentry/utils';
import {LeMuiUtils} from '../LeMuiUtils';
import TextField, {TextFieldProps} from './TextField';

const getProcessedValue = (
	value: unknown,
	decimals: number,
	allowZero: boolean,
	allowNegative: boolean,
): {text: string; val: number} => 
{
	let text = LeMuiUtils.purgePrependedHiddenChar(STRING(value));
	let val = 0;

	const negative = text.includes('-');

	text = text.replace(',', '.').replace(/[^0-9.]/g, '');
	if (text !== '') 
	{
		let stringVal = Math.abs(FLOAT_LAX(text)).toFixed(decimals + 1); // prevents rounding (by adding an extra digit and then cutting it off)
		stringVal = stringVal.substring(0, stringVal.length - 1);

		const textDotCount = text.split('.').length - 1;
		if (textDotCount <= 0 || decimals <= 0) 
		{
			text = stringVal.split('.')[0];
		}
		else if (textDotCount === 1 && text.endsWith('.')) 
		{
			text = stringVal.split('.')[0] + '.';
		}
		else 
		{
			text = stringVal.substring(0, stringVal.length - Math.max(0, decimals - text.split('.')[1].length));
		}

		if (!allowZero && text === '0') 
		{
			text = '';
		}
	}

	if (allowNegative && negative) 
	{
		text = '-' + text;
	}

	val = FLOAT_LAX(text);
	if (val !== 0) 
	{
		if (decimals > 0) 
		{
			val = Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
		}
		else 
		{
			val = Math.round(val);
		}
	}

	return {text, val};
};

export interface NumericChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {
	target: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>['target'] & {
		value: number | null;
		valueText: string;
		valueRaw: string;
	};
}

export interface NumericTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
	decimals?: number;
	allowZero?: boolean;
	allowNegative?: boolean;
	value?: unknown;
	onChange?: (event: NumericChangeEvent) => void;
	onRenderValue?: (value: string) => string;
}

export const NumericTextField = memo(
	({
		decimals: decimalsProp,
		allowZero: allowZeroProp,
		allowNegative: allowNegativeProp,
		value,
		onChange,
		onRenderValue,
		className,
		inputProps,
		children,
		...props
	}: NumericTextFieldProps) => 
	{
		const allowZero = !!allowZeroProp;
		const allowNegative = !!allowNegativeProp;
		const decimals = INT_LAX_ANY(decimalsProp, 0);

		const getVisualValue = useCallback(
			(val: unknown) => 
			{
				return getProcessedValue(val, decimals, allowZero, allowNegative).text;
			},
			[decimals, allowZero, allowNegative],
		);

		const [visualValue, setVisualValue] = useState(getVisualValue(value));

		useEffect(() => 
		{
			const newVisualValue = getVisualValue(value);
			if (FLOAT_LAX(visualValue) !== FLOAT_LAX(newVisualValue)) 
			{
				setVisualValue(newVisualValue);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [value, getVisualValue]);

		const onChanged = useCallback(
			(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
			{
				const originalTargetValue = event.target.value;
				const {text, val} = getProcessedValue(originalTargetValue, decimals, allowZero, allowNegative);

				setVisualValue(text);

				if (onChange) 
				{
					// Create a new event with augmented target properties
					// We use a plain object to avoid jsdom prototype setter issues
					const newTarget = {
						...event.target,
						value: val,
						valueText: text,
						valueRaw: originalTargetValue,
					};
					const newEvent: NumericChangeEvent = {
						...event,
						// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Custom event target augmentation
						target: newTarget as NumericChangeEvent['target'],
					};
					onChange(newEvent);
				}
			},
			[onChange, decimals, allowZero, allowNegative],
		);

		return (
			<TextField
				className={'lowentry-mui--numeric-textfield ' + (className ?? '')}
				type="text"
				inputProps={{inputMode: 'decimal', ...(inputProps ?? {})}}
				value={onRenderValue ? onRenderValue(visualValue) : visualValue}
				onChange={onChanged}
				{...props}
			>
				{children}
			</TextField>
		);
	},
);

export default NumericTextField;
