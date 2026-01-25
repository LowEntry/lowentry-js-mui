import React from 'react';
import {memo, useCallback} from '@lowentry/react-redux';
import {LeMuiUtils} from '../LeMuiUtils';
import NumericTextField, {NumericTextFieldProps, NumericChangeEvent} from './NumericTextField';

export interface RemovableNumericTextFieldProps extends Omit<NumericTextFieldProps, 'onSelect'> {
	onRemove?: (event: NumericChangeEvent) => void;
	onSelect?: (event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const RemovableNumericTextField = memo(
	({onRemove, onChange, onSelect, className, children, ...props}: RemovableNumericTextFieldProps) => 
	{
		const onChanged = useCallback(
			(event: NumericChangeEvent) => 
			{
				if (event.target.valueRaw === '') 
				{
					if (onRemove) 
					{
						onRemove(event);
					}
					return;
				}

				if (onChange) 
				{
					onChange(event);
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
			<NumericTextField
				className={
					'lowentry-mui--removable-textfield lowentry-mui--removable-numeric-textfield ' + (className ?? '')
				}
				onRenderValue={LeMuiUtils.prependHiddenChar}
				onChange={onChanged}
				onSelect={onSelectedWrapper}
				{...props}
			>
				{children}
			</NumericTextField>
		);
	},
);

export default RemovableNumericTextField;
