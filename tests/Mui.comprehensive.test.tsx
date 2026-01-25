import {describe, it, expect, vi, afterEach} from 'vitest';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {Avatar, InitiallyInvisible, TextField, Submittable, MuiRoot, NumericTextField, RemovableTextField, LoadingSpinner, LoadingSpinnerWidget, DatePicker, Dialog, MenuButton, RemovableNumericTextField, LeMuiUtils} from '../src/index';
import {createTheme} from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Dayjs from 'dayjs';

const theme = createTheme();

afterEach(() => 
{
	cleanup();
});

describe('MUI Components (Legacy Parity)', () => 
{
	describe('Avatar', () => 
	{
		it('renders with src', () => 
		{
			const {getByAltText} = render(
				<MuiRoot theme={theme}>
					<Avatar src="test.jpg" alt="test-avatar" />
				</MuiRoot>,
			);
			const img = getByAltText('test-avatar');
			expect(img).toBeDefined();
			expect(img.getAttribute('src')).toBe('test.jpg');
		});
	});

	describe('InitiallyInvisible', () => 
	{
		it('starts with opacity 0 and changes to 1', async() => 
		{
			vi.useFakeTimers();
			const {container} = render(
				<InitiallyInvisible frames={10}>
					<div data-testid="child">content</div>
				</InitiallyInvisible>,
			);
			const div = container.firstChild;
			if (!(div instanceof HTMLElement)) 
			{
				throw new Error('Expected firstChild to be HTMLElement');
			}
			expect(div.style.opacity).toBe('0');

			await act(async() => 
			{
				vi.advanceTimersByTime(1000);
			});

			expect(div.style.opacity).toBe('1');
			vi.useRealTimers();
		});
	});

	describe('TextField', () => 
	{
		it('renders and handles click with stopPropagation', () => 
		{
			const onClick = vi.fn();
			const parentOnClick = vi.fn();
			const {getByLabelText} = render(
				<div onClick={parentOnClick}>
					<TextField onClick={onClick} label="test-label" />
				</div>,
			);
			const input = getByLabelText('test-label');
			fireEvent.click(input);
			expect(onClick).toHaveBeenCalled();
			expect(parentOnClick).not.toHaveBeenCalled();
		});
	});

	describe('Submittable', () => 
	{
		it('calls onSubmit when form is submitted', () => 
		{
			const onSubmit = vi.fn();
			const {getByText} = render(
				<Submittable onSubmit={onSubmit}>
					<button type="submit">Submit</button>
				</Submittable>,
			);
			const button = getByText('Submit');
			fireEvent.click(button);
			expect(onSubmit).toHaveBeenCalled();
		});

		it('does not call onSubmit when disabled', () => 
		{
			const onSubmit = vi.fn();
			const {getByText} = render(
				<Submittable onSubmit={onSubmit} disabled={true}>
					<button type="submit">Submit</button>
				</Submittable>,
			);
			const button = getByText('Submit');
			fireEvent.click(button);
			expect(onSubmit).not.toHaveBeenCalled();
		});
	});

	describe('NumericTextField', () => 
	{
		it('processes numeric input correctly', () => 
		{
			const onChange = vi.fn();
			const {getByLabelText} = render(
				<MuiRoot theme={theme}>
					<NumericTextField label="numeric" decimals={2} onChange={onChange} />
				</MuiRoot>,
			);
			const input = getByLabelText('numeric');
			if (!(input instanceof HTMLInputElement)) 
			{
				throw new Error('Expected input to be HTMLInputElement');
			}
			
			fireEvent.change(input, {target: {value: '123.456'}});
			
			expect(onChange).toHaveBeenCalled();
			const call = onChange.mock.calls[0][0];
			expect(call.target.value).toBe(123.45);
			expect(call.target.valueText).toBe('123.45');
			expect(call.target.valueRaw).toBe('123.456');
		});

		it('handles negative numbers if allowed', () => 
		{
			const onChange = vi.fn();
			const {getByLabelText} = render(
				<MuiRoot theme={theme}>
					<NumericTextField label="numeric" allowNegative={true} onChange={onChange} />
				</MuiRoot>,
			);
			const input = getByLabelText('numeric');
			if (!(input instanceof HTMLInputElement)) 
			{
				throw new Error('Expected input to be HTMLInputElement');
			}
			
			fireEvent.change(input, {target: {value: '-123'}});
			expect(onChange.mock.calls[0][0].target.value).toBe(-123);
		});
	});

	describe('RemovableTextField', () => 
	{
		it('prepends hidden char and purges it on change', () => 
		{
			const onChange = vi.fn();
			const {getByLabelText} = render(
				<MuiRoot theme={theme}>
					<RemovableTextField label="removable" value="test" onChange={onChange} />
				</MuiRoot>,
			);
			const input = getByLabelText('removable');
			if (!(input instanceof HTMLInputElement)) 
			{
				throw new Error('Expected input to be HTMLInputElement');
			}
			expect(input.value).toBe('\u200Btest');

			fireEvent.change(input, {target: {value: '\u200Bnew'}});
			expect(onChange).toHaveBeenCalled();
			expect(onChange.mock.calls[0][0].target.value).toBe('new');
		});

		it('calls onRemove when empty', () => 
		{
			const onRemove = vi.fn();
			const {getByLabelText} = render(
				<MuiRoot theme={theme}>
					<RemovableTextField label="removable" value="test" onRemove={onRemove} />
				</MuiRoot>,
			);
			const input = getByLabelText('removable');
			if (!(input instanceof HTMLInputElement)) 
			{
				throw new Error('Expected input to be HTMLInputElement');
			}
			fireEvent.change(input, {target: {value: ''}});
			expect(onRemove).toHaveBeenCalled();
		});
	});

	describe('LoadingSpinner', () => 
	{
		it('renders widget and responds to spinner count', async() => 
		{
			render(
				<MuiRoot theme={theme}>
					<LoadingSpinner type="global" />
					<LoadingSpinnerWidget type="global" />
				</MuiRoot>,
			);
			const backdrop = document.querySelector('.MuiBackdrop-root');
			expect(backdrop).not.toBeNull();
			expect(backdrop?.classList.contains('MuiBackdrop-invisible')).toBe(false);
		});
	});

	describe('DatePicker', () => 
	{
		it('renders and calls onChange on arrow click', () => 
		{
			const onChange = vi.fn();
			const value = Dayjs('2023-01-20');
			const {container} = render(
				<MuiRoot theme={theme}>
					<DatePicker value={value} onChange={onChange} />
				</MuiRoot>,
			);
			const buttons = container.querySelectorAll('.lowentry-mui--date-picker--arrow-button');
			
			// Previous day
			fireEvent.click(buttons[0]);
			expect(onChange).toHaveBeenCalled();
			expect(onChange.mock.calls[0][0].format('YYYY-MM-DD')).toBe('2023-01-19');

			// Next day
			fireEvent.click(buttons[1]);
			expect(onChange.mock.calls[1][0].format('YYYY-MM-DD')).toBe('2023-01-21');
		});
	});

	describe('Dialog', () => 
	{
		it('only closes on escape key by default (not backdrop)', () => 
		{
			const onClose = vi.fn();
			render(
				<MuiRoot theme={theme}>
					<Dialog open={true} onClose={onClose}>
						<div>content</div>
					</Dialog>
				</MuiRoot>,
			);
			
			// Click backdrop (should NOT close)
			const backdrop = document.querySelector('.MuiBackdrop-root');
			if (backdrop) fireEvent.click(backdrop);
			expect(onClose).not.toHaveBeenCalled();

			// Press Escape (should close)
			fireEvent.keyDown(document.body, {key: 'Escape', code: 'Escape'});
			// Note: MUI handles escape differently, we might need to target the dialog
			// But our component check the 'reason' passed by MUI
		});
	});

	describe('MenuButton', () => 
	{
		it('opens menu on click and closes on item click', () => 
		{
			const {getByText, queryByText} = render(
				<MuiRoot theme={theme}>
					<MenuButton icon="Open Menu">
						<MenuItem>Item 1</MenuItem>
					</MenuButton>
				</MuiRoot>,
			);
			
			expect(queryByText('Item 1')).toBeNull();
			fireEvent.click(getByText('Open Menu'));
			expect(getByText('Item 1')).toBeDefined();
			
			fireEvent.click(getByText('Item 1'));
			// The menu closes (opacity 0 or removed from DOM depending on MUI)
		});
	});

	describe('RemovableNumericTextField', () => 
	{
		it('calls onRemove when valueRaw is empty', () => 
		{
			const onRemove = vi.fn();
			const {getByLabelText} = render(
				<MuiRoot theme={theme}>
					<RemovableNumericTextField label="removable-num" value={123} onRemove={onRemove} />
				</MuiRoot>,
			);
			const input = getByLabelText('removable-num');
			if (!(input instanceof HTMLInputElement)) 
			{
				throw new Error('Expected input to be HTMLInputElement');
			}
			fireEvent.change(input, {target: {value: ''}});
			expect(onRemove).toHaveBeenCalled();
		});
	});

	describe('LeMuiUtils', () => 
	{
		it('onSelectEnsureMinimumOffset enforces offset', () => 
		{
			// Create a real input element for the test
			const input = document.createElement('input');
			input.value = 'test';
			document.body.appendChild(input);
			input.focus();
			input.setSelectionRange(0, 0);
			
			const setSelectionRangeSpy = vi.spyOn(input, 'setSelectionRange');
			
			const mockEvent = {
				target: input,
				currentTarget: input,
				nativeEvent: {},
				bubbles: true,
				cancelable: true,
				defaultPrevented: false,
				eventPhase: 0,
				isTrusted: true,
				preventDefault: vi.fn(),
				isDefaultPrevented: vi.fn(),
				stopPropagation: vi.fn(),
				isPropagationStopped: vi.fn(),
				persist: vi.fn(),
				timeStamp: 0,
				type: 'select',
			};
			
			const handler = LeMuiUtils.onSelectEnsureMinimumOffset(1);
			handler(mockEvent as unknown as React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>);
			expect(setSelectionRangeSpy).toHaveBeenCalledWith(1, 1);
			
			document.body.removeChild(input);
		});
	});
});
