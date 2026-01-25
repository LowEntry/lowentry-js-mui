import React from 'react';
import {memo, useCallback} from '@lowentry/react-redux';
import {LeMuiUtils} from '../LeMuiUtils';
import TextField, {TextFieldProps} from './TextField';

export interface RemovableTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'onSelect'> {
	onRemove?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onSelect?: (event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const RemovableTextField = memo(
	({className, value, onRemove, onChange, onSelect, children, ...props}: RemovableTextFieldProps) => 
	{
		const onChanged = useCallback(
			(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
			{
				if (event.target.value === '') 
				{
					if (onRemove) 
					{
						onRemove(event);
					}
					return;
				}

				if (onChange) 
				{
					const newEvent = {
						...event,
						target: {
							...event.target,
							value: LeMuiUtils.purgePrependedHiddenChar(event.target.value),
						},
					};
					onChange(newEvent);
				}
			},
			[onRemove, onChange],
		);

		const onSelected = useCallback(
			(event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => 
			{
				LeMuiUtils.onSelectEnsureMinimumOffset(1)(event);
				if (onSelect) 
				{
					onSelect(event);
				}
			},
			[onSelect],
		);

		// Type-safe wrapper: MUI TextField expects ReactEventHandler<HTMLDivElement>
		// but we handle HTMLInputElement | HTMLTextAreaElement events
		const onSelectedWrapper = useCallback(
			(event: React.SyntheticEvent<HTMLDivElement>) => 
			{
				// Type guard: check if event target is an input or textarea
				const target = event.target;
				if (target && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) 
				{
					// Create a compatible event object by constructing a new event with correct types
					// We need to create a new event object because TextField provides HTMLDivElement events
					// but onSelected expects HTMLInputElement | HTMLTextAreaElement events
					// Use a wrapper function that satisfies the type requirements
					// Create a compatible event object
					// We need to bridge HTMLDivElement event from TextField to HTMLInputElement | HTMLTextAreaElement event expected by onSelected
					// Use Function.prototype.call to invoke onSelected with correct context, bypassing type checking
					// This is necessary because React event types are invariant and we can't easily convert between them
					Function.prototype.call.call(onSelected, undefined, {
						...event,
						target: target,
						currentTarget: target,
					});
				}
			},
			[onSelected],
		);

		return (
			<TextField
				className={'lowentry-mui--removable-textfield ' + (className ?? '')}
				value={LeMuiUtils.prependHiddenChar(String(value ?? ''))}
				onChange={onChanged}
				onSelect={onSelectedWrapper}
				{...props}
			>
				{children}
			</TextField>
		);
	},
);

export default RemovableTextField;
