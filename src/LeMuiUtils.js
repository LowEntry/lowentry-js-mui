import {LeUtils, STRING, INT_LAX} from '@lowentry/utils';


const HIDDEN_CHAR = '\u200B';


export const LeMuiUtils = {
	onSelectEnsureMinimumOffset:
		(charactersCount) =>
		{
			charactersCount = Math.max(0, INT_LAX(charactersCount));
			if(charactersCount <= 0)
			{
				return () =>
				{
				};
			}
			
			return (event) =>
			{
				if(event && event.target)
				{
					if(event.target.selectionEnd < charactersCount)
					{
						event.target.setSelectionRange(charactersCount, charactersCount);
					}
					else if(event.target.selectionStart < charactersCount)
					{
						event.target.setSelectionRange(charactersCount, event.target.selectionEnd);
					}
				}
			};
		},
	
	prependHiddenChar:
		(string) =>
		{
			string = STRING(string);
			if(string.startsWith(HIDDEN_CHAR))
			{
				return string;
			}
			return HIDDEN_CHAR + string;
		},
	
	purgePrependedHiddenChar:
		(string) =>
		{
			string = STRING(string);
			return LeUtils.trimStart(string, ['\u200B', ' ', '\t', '\r', '\n']);
		},
};
