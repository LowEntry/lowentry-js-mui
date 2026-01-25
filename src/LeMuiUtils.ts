import * as React from 'react';
import {LeUtils, STRING, INT_LAX} from '@lowentry/utils';

const HIDDEN_CHAR = '\u200B';

export const LeMuiUtils = {
	onSelectEnsureMinimumOffset: (charactersCount: number): ((event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => 
	{
		const count = Math.max(0, INT_LAX(charactersCount));
		if (count <= 0) 
		{
			return (): void => 
			{};
		}

		return (event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>): void => 
		{
			// Type guard: verify target is HTMLInputElement or HTMLTextAreaElement
			const target = event.target;
			if (target && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && 'selectionEnd' in target && 'selectionStart' in target && 'setSelectionRange' in target) 
			{
				const selectionEnd = target.selectionEnd ?? 0;
				const selectionStart = target.selectionStart ?? 0;
				
				if (selectionEnd < count) 
				{
					target.setSelectionRange(count, count);
				}
				else if (selectionStart < count) 
				{
					target.setSelectionRange(count, selectionEnd);
				}
			}
		};
	},

	prependHiddenChar: (string: string): string => 
	{
		const str = STRING(string);
		if (str.startsWith(HIDDEN_CHAR)) 
		{
			return str;
		}
		return HIDDEN_CHAR + str;
	},

	purgePrependedHiddenChar: (string: string): string => 
	{
		const str = STRING(string);
		return LeUtils.trimStart(str, ['\u200B', ' ', '\t', '\r', '\n']);
	},
};

export default LeMuiUtils;
