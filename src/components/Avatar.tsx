import React from 'react';
import {memo, useRetryingImageUrl, useCallback} from '@lowentry/react-redux';
import MuiAvatar, {AvatarProps as MuiAvatarProps} from '@mui/material/Avatar';

export interface AvatarRetryOptions {
	retries?: number;
	delay?: number | ((retries: number) => number);
	queryParam?: string;
}

export interface AvatarSlotProps {
	img?: React.ImgHTMLAttributes<HTMLImageElement> & {
		onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
	};
	[key: string]: unknown;
}

export interface AvatarProps extends Omit<MuiAvatarProps, 'src' | 'slotProps'> {
	src?: string;
	retryOptions?: AvatarRetryOptions;
	slotProps?: AvatarSlotProps;
}

export const Avatar = memo(({src, slotProps, retryOptions, children, ...props}: AvatarProps) => 
{
	const [imgSrc, onImgError] = useRetryingImageUrl(src ?? '', retryOptions ?? {});

	const onError = useCallback(
		(event: React.SyntheticEvent<HTMLImageElement>) => 
		{
			onImgError();

			if (slotProps?.img?.onError) 
			{
				slotProps.img.onError(event);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[onImgError, slotProps?.img?.onError],
	);

	return (
		<MuiAvatar
			src={imgSrc}
			slotProps={{
				...(slotProps ?? {}),
				img: {
					referrerPolicy: 'no-referrer',
					...(slotProps?.img ?? {}),
					onError: onError,
				},
			}}
			{...props}
		>
			{children}
		</MuiAvatar>
	);
});

export default Avatar;
