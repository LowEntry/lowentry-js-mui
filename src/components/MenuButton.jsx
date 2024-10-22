import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {LeUtils, ARRAY} from '@lowentry/utils';
import {Button, Menu} from '@mui/material';


const MenuButton = LeRed.memo(({icon, className, ref, onClick, onClose, children, ...props}) =>
{
	const buttonRef = LeRed.useRef();
	const [open, setOpen] = LeRed.useState(false);
	
	
	const onClicked = LeRed.useCallback((event) =>
	{
		setOpen(true);
		
		if(onClick)
		{
			onClick(event);
		}
	}, [onClick]);
	
	
	const onClosed = LeRed.useCallback((event) =>
	{
		setOpen(false);
		
		if(onClose)
		{
			onClose(event);
		}
	}, [onClose]);
	
	
	return (<>
		<Button ref={LeRed.mergeRefs(buttonRef, ref)} className={'lowentry-mui--menu-button ' + (className ?? '')} variant="text" color="primary" onClick={onClicked} {...props}>{icon}</Button>
		<Menu anchorEl={buttonRef.current} open={open} onClose={onClosed}>
			{LeUtils.mapToArray(ARRAY(children), (child, index) => !!child && LeRed.cloneElement(child, {
				key:     index,
				onClick: () =>
				         {
					         setOpen(false);
					         if(child?.props?.onClick)
					         {
						         child.props.onClick();
					         }
				         },
				disabled:(typeof child?.props?.disabled !== 'undefined') ? child.props.disabled : !child?.props?.onClick,
			}))}
		</Menu>
	</>);
});
export default MenuButton;
