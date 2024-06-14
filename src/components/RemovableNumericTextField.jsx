import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {LeMuiUtils} from '../LeMuiUtils';
import NumericTextField from './NumericTextField.jsx';


const RemovableNumericTextField = LeRed.memo(({onRemove, onChange, onSelect, className, children, ...props}) =>
{
	const onChanged = LeRed.useCallback((event) =>
	{
		if(event.target.valueRaw === '')
		{
			if(onRemove)
			{
				onRemove(event);
			}
			return;
		}
		
		if(onChange)
		{
			onChange(event);
		}
	}, [onRemove, onChange]);
	
	
	const onSelected = LeRed.useCallback((event) =>
	{
		LeMuiUtils.onSelectEnsureMinimumOffset(1)(event);
		if(onSelect)
		{
			onSelect(event);
		}
	}, [onSelect]);
	
	
	return (<>
		<NumericTextField className={'lowentry-mui--removable-textfield lowentry-mui--removable-numeric-textfield ' + (className ?? '')} onRenderValue={LeMuiUtils.prependHiddenChar} onChange={onChanged} onSelect={onSelected} {...props}>{children}</NumericTextField>
	</>);
});
export default RemovableNumericTextField;
