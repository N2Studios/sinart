import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@sin-art-universe/ui';

describe('Web App', () => {
  it('renders landing page title', async () => {
    render(<div>Sin Art Universe</div>);
    expect(screen.getByText('Sin Art Universe')).toBeInTheDocument();
  });
  
  it('renders Button component', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument();
  });
  
  it('renders Button with neon styling', () => {
    render(<Button variant="default">Click</Button>);
    const button = screen.getByText('Click');
    expect(button).toHaveClass('bg-neonCyan');
  });
  
  it('renders Button with outline variant', () => {
    render(<Button variant="outline">Click</Button>);
    const button = screen.getByText('Click');
    expect(button).toHaveClass('border-neonCyan');
  });
}); 