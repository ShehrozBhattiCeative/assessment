import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './Badge';

describe('Badge component', () => {
  it('renders children', () => {
    render(<Badge>Pending</Badge>);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders a dot when dot prop is true', () => {
    const { container } = render(<Badge dot>Active</Badge>);
    const dot = container.querySelector('.rounded-full');
    expect(dot).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<Badge variant="success">Done</Badge>);
    expect(container.firstChild).toHaveClass('bg-[#d1fae5]');
  });

  it('applies sm size class', () => {
    const { container } = render(<Badge size="sm">Tag</Badge>);
    expect(container.firstChild).toHaveClass('text-xs');
  });

  it('renders neutral variant by default', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('bg-[#f3f4f6]');
  });
});
