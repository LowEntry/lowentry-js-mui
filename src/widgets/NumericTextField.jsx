import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {LeUtils, FLOAT_LAX, INT_LAX_ANY} from '@lowentry/utils';
import {TextField} from './TextField.jsx';
import {LeMuiUtils} from '../LeMuiUtils.js';


export const NumericTextField = LeRed.memo(({decimals, allowZero, allowNegative, value, onChange, onRenderValue, className, inputProps, children, ...props}) =>
{
	if(typeof allowZero === 'undefined')
	{
		allowZero = true;
	}
	if(typeof allowNegative === 'undefined')
	{
		allowNegative = true;
	}
	decimals = INT_LAX_ANY(decimals, 2);
	
	
	const getVisualValue = (value) =>
	{
		let text = FLOAT_LAX(LeMuiUtils.purgePrependedHiddenChar(value));
		if(!allowNegative)
		{
			text = Math.abs(text);
		}
		
		text = text.toFixed(decimals); // rounds it
		text = LeUtils.trimEnd(LeUtils.trimEnd(text, '0'), '.');
		if(!allowZero && (text === '0'))
		{
			text = '';
		}
		return text;
	};
	
	
	const [visualValue, setVisualValue] = LeRed.useState(getVisualValue(value));
	
	LeRed.useEffect(() =>
	{
		setVisualValue(getVisualValue(value));
	}, [value]);
	
	
	const onChanged = LeRed.useCallback((event) =>
	{
		const originalTargetValue = event.target.value;
		const targetValue = LeMuiUtils.purgePrependedHiddenChar(originalTargetValue);
		
		let text = targetValue;
		let val = 0;
		
		{// visual >>
			const minus = text.includes('-');
			text = text.replace(',', '.').replace(/[^0-9.]/g, '');
			if(text !== '')
			{
				val = Math.abs(FLOAT_LAX(text));
				if(allowNegative && minus)
				{
					val = -val;
				}
				
				let stringVal = val.toFixed(decimals + 1); // prevents rounding (by adding an extra digit and then cutting it off)
				stringVal = stringVal.substring(0, stringVal.length - 1);
				
				if(!text.includes('.') || (decimals <= 0))
				{
					text = stringVal.split('.')[0];
				}
				else if(text.endsWith('.'))
				{
					text = stringVal.split('.')[0] + '.';
				}
				else
				{
					text = stringVal.substring(0, stringVal.length - Math.max(0, decimals - text.split('.')[1].length));
				}
				setVisualValue(text);
			}
		}// visual <<
		
		if(onChange)
		{
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
