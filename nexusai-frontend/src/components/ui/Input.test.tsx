import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from './Input';

describe('Input component', () => {
  it('renders without crashing', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Email Address" />);
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show asterisk when not required', () => {
    render(<Input label="Email" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays error message when error prop is set', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays hint when hint prop is set and no error', () => {
    render(<Input hint="Format: user@example.com" />);
    expect(screen.getByText('Format: user@example.com')).toBeInTheDocument();
  });

  it('hides hint when error is also set', () => {
    render(<Input hint="A hint" error="An error" />);
    expect(screen.queryByText('A hint')).not.toBeInTheDocument();
    expect(screen.getByText('An error')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('fires onChange when typing', () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders right icon button and calls onRightIconClick', () => {
    const onRightIconClick = jest.fn();
    render(
      <Input
        rightIcon={<span data-testid="right-icon">X</span>}
        onRightIconClick={onRightIconClick}
      />
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onRightIconClick).toHaveBeenCalledTimes(1);
  });

  it('renders left icon', () => {
    render(<Input leftIcon={<span data-testid="left-icon">@</span>} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<Input label="Username" id="username-input" />);
    const label = screen.getByText('Username');
    expect(label).toHaveAttribute('for', 'username-input');
  });
});
