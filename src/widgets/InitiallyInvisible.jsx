import React from 'react';
import {LeRed} from '@lowentry/react-redux';
import {LeUtils, INT_LAX} from '@lowentry/utils';


const InitiallyInvisible = LeRed.memo(({frames, transition, style, children, opacityKey, ...other}) =>
{
	const [opacity, setOpacity] = LeRed.useState(0);
	
	
	LeRed.useEffect(() =>
	{
		setOpacity(0);
		return LeUtils.setAnimationFrameTimeout(() => setOpacity(1), Math.max((opacityKey ? 2 : 0), INT_LAX(frames))).remove;
	}, [opacityKey]);
	
	
	return (<div style={{width:'100%', height:'100%', opacity, transition:(((opacity > 0) && transition) ? ('opacity ' + transition) : 'none'), ...(style ?? {})}} {...other}>{children}</div>);
});
export default InitiallyInvisible;
