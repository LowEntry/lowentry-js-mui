import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {FLOAT_LAX, INT_LAX_ANY, STRING} from '@lowentry/utils';
import {LeMuiUtils} from '../LeMuiUtils.js';
import TextField from './TextField.jsx';


const getProcessedValue = (value, decimals, allowZero, allowNegative) =>
{
	let text = LeMuiUtils.purgePrependedHiddenChar(STRING(value));
	let val = 0;
	
	const negative = text.includes('-');
	
	text = text.replace(',', '.').replace(/[^0-9.]/g, '');
	if(text !== '')
	{
		let stringVal = Math.abs(FLOAT_LAX(text)).toFixed(decimals + 1); // prevents rounding (by adding an extra digit and then cutting it off)
		stringVal = stringVal.substring(0, stringVal.length - 1);
		
		const textDotCount = text.split('.').length - 1;
		if((textDotCount <= 0) || (decimals <= 0))
		{
			text = stringVal.split('.')[0];
		}
		else if((textDotCount === 1) && text.endsWith('.'))
		{
			text = stringVal.split('.')[0] + '.';
		}
		else
		{
			text = stringVal.substring(0, stringVal.length - Math.max(0, decimals - text.split('.')[1].length));
		}
		
		if(!allowZero && (text === '0'))
		{
			text = '';
		}
	}
	
	if(allowNegative && negative)
	{
		text = '-' + text;
	}
	
	val = FLOAT_LAX(text);
	if(val !== 0)
	{
		if(decimals > 0)
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


const NumericTextField = LeRed.memo(({decimals, allowZero, allowNegative, value, onChange, onRenderValue, className, inputProps, children, ...props}) =>
{
	allowZero = !!allowZero;
	allowNegative = !!allowNegative;
	decimals = INT_LAX_ANY(decimals, 0);
	
	
	const getVisualValue = LeRed.useCallback((value) =>
	{
		return getProcessedValue(value, decimals, allowZero, allowNegative).text;
	}, [decimals, allowZero, allowNegative]);
	
	
	const [visualValue, setVisualValue] = LeRed.useState(getVisualValue(value));
	
	LeRed.useEffect(() =>
	{
		const newVisualValue = getVisualValue(value);
		if(FLOAT_LAX(visualValue) !== FLOAT_LAX(newVisualValue))
		{
			setVisualValue(newVisualValue);
		}
	}, [value, getVisualValue]);
	
	
	const onChanged = LeRed.useCallback((event) =>
	{
		const originalTargetValue = event.target.value;
		const {text, val} = getProcessedValue(originalTargetValue, decimals, allowZero, allowNegative);
		
		setVisualValue(text);
		
		if(onChange)
		{
			const newEvent = {
				...event,
				target:{
					...event.target,
					value:    val,
					valueText:text,
					valueRaw: originalTargetValue,
				},
			};
			onChange(newEvent);
		}
	}, [onChange]);
	
	
	return (<>
		<TextField className={'lowentry-mui--numeric-textfield ' + (className ?? '')} type="text" inputProps={{inputMode:'decimal', ...(inputProps ?? {})}} value={!!onRenderValue ? onRenderValue(visualValue) : visualValue} onChange={onChanged} {...props}>{children}</TextField>
	</>);
});
export default NumericTextField;
