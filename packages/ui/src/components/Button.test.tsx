import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-neonCyan');
  });

  it('renders button with outline variant', () => {
    render(<Button variant="outline">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('border-neonCyan');
  });

  it('renders button with large size', () => {
    render(<Button size="lg">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('h-12');
  });
}); 