import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {LeMuiUtils} from '../LeMuiUtils';
import TextField from './TextField.jsx';


const RemovableTextField = LeRed.memo(({className, value, onRemove, onChange, onSelect, children, ...props}) =>
{
	const onChanged = LeRed.useCallback((event) =>
	{
		if(event.target.value === '')
		{
			if(onRemove)
			{
				onRemove(event);
			}
			return;
		}
		
		if(onChange)
		{
			const newEvent = {
				...event,
				target:{
					...event.target,
					value:LeMuiUtils.purgePrependedHiddenChar(event.target.value),
				},
			};
			onChange(newEvent);
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
		<TextField className={'lowentry-mui--removable-textfield ' + (className ?? '')} value={LeMuiUtils.prependHiddenChar(value)} onChange={onChanged} onSelect={onSelected} {...props}>{children}</TextField>
	</>);
});
export default RemovableTextField;
