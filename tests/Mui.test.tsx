import {describe, it, expect} from 'vitest';
import {LeMuiUtils} from '../src/index';

describe('LeMuiUtils (Legacy Parity)', () => 
{
	it('prependHiddenChar should add a hidden character if not present', () => 
	{
		const result = LeMuiUtils.prependHiddenChar('test');
		expect(result).toBe('\u200Btest');
	});

	it('prependHiddenChar should not add a hidden character if already present', () => 
	{
		const result = LeMuiUtils.prependHiddenChar('\u200Btest');
		expect(result).toBe('\u200Btest');
	});

	it('purgePrependedHiddenChar should remove hidden characters and whitespace from start', () => 
	{
		const result = LeMuiUtils.purgePrependedHiddenChar('\u200B  test');
		expect(result).toBe('test');
	});
});
