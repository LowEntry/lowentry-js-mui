import React, {cloneElement} from 'react';
import {memo, useRef, useState, useCallback, mergeRefs} from '@lowentry/react-redux';
import {LeUtils, ARRAY} from '@lowentry/utils';
import Button, {ButtonProps} from '@mui/material/Button';
import Menu from '@mui/material/Menu';

export interface MenuButtonProps extends Omit<ButtonProps, 'onClick'> {
	icon?: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onClose?: (event: React.MouseEvent) => void;
	children?: React.ReactNode;
	ref?: React.Ref<HTMLButtonElement>;
}

export const MenuButton = memo(({icon, className, ref, onClick, onClose, children, ...props}: MenuButtonProps) => 
{
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [open, setOpen] = useState(false);

	const onClicked = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => 
		{
			setOpen(true);

			if (onClick) 
			{
				onClick(event);
			}
		},
		[onClick],
	);

	const onClosed = useCallback(
		(event: React.MouseEvent) => 
		{
			setOpen(false);

			if (onClose) 
			{
				onClose(event);
			}
		},
		[onClose],
	);

	return (
		<>
			<Button
				ref={mergeRefs(buttonRef, ref ?? null)}
				className={'lowentry-mui--menu-button ' + (className ?? '')}
				variant="text"
				color="primary"
				onClick={onClicked}
				{...props}
			>
				{icon}
			</Button>
			{/* eslint-disable-next-line react-hooks/refs */}
			<Menu anchorEl={buttonRef.current} open={open} onClose={onClosed}>
				{
					// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Dynamic children mapping
					LeUtils.mapToArray(ARRAY(children), (child: unknown, index: unknown): React.ReactElement | null =>
					{
						if (!child || !React.isValidElement(child)) 
						{
							return null;
						}

						const indexNum = typeof index === 'number' ? index : 0;
						// Type guard: check if child.props has onClick and disabled
						const isRecordLike = (value: unknown): value is Record<string, unknown> => 
							typeof value === 'object' && value !== null;
						const childProps = isRecordLike(child.props) ? child.props : {};
						const hasOnClick = 'onClick' in childProps && typeof childProps.onClick === 'function';
						const hasDisabled = 'disabled' in childProps && typeof childProps.disabled === 'boolean';

						// Construct new props with type guards
						const newProps = {
							...childProps,
							key: indexNum,
							onClick: (): void => 
							{
								setOpen(false);
								if (hasOnClick && typeof childProps.onClick === 'function') 
								{
								// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Dynamic click handler extraction
									const clickHandler = childProps.onClick as () => void;
									clickHandler();
								}
							},
							disabled: hasDisabled ? !!childProps.disabled : !hasOnClick,
						};

						// React.cloneElement requires exact prop type matching which is difficult with dynamic props
						// We use a type assertion here as the type guards above ensure runtime safety
						 
						return cloneElement(child, newProps as Partial<unknown>);
					}) as React.ReactElement[]}
			</Menu>
		</>
	);
});

export default MenuButton;
