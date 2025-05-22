import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

// Mock keep-react Button component
jest.mock('keep-react', () => ({
  Button: ({ children, disabled, onClick, ...props }: any) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled ? 'true' : undefined}
      aria-busy={props['aria-busy']}
      aria-live={props['aria-live']}
      data-testid="keep-button"
      {...props}
    >
      {children}
    </button>
  )
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    )
  }
}));

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    
    const button = screen.getByTestId('keep-button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toBeDisabled();
  });

  it('applies the loading state correctly', () => {
    render(<Button isLoading>Click me</Button>);
    
    const button = screen.getByTestId('keep-button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('aria-live', 'polite');
    
    // Check for spinner by aria-hidden attribute
    const spinner = screen.getByText('', { selector: '.inline-block.mr-2.h-4.w-4[aria-hidden="true"]' });
    expect(spinner).toBeInTheDocument();
    
    // Check for screen reader text
    const srOnly = screen.getByText('Loading');
    expect(srOnly).toHaveClass('sr-only');
  });

  it('uses custom loading text when provided', () => {
    render(<Button isLoading loadingText="Processing...">Click me</Button>);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading', { selector: '.sr-only' })).not.toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    
    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText('Danger')).toBeInTheDocument();
    
    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toBeInTheDocument();
    
    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('applies fullWidth prop correctly', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    // Since we're using a wrapper div when animation is enabled,
    // we need to check if it has the w-full class
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toHaveClass('w-full');
  });

  it('renders with an icon', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;
    render(<Button icon={<TestIcon />}>With Icon</Button>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('has correct aria attributes when disabled and loading', () => {
    render(<Button disabled isLoading>Loading Button</Button>);
    
    const button = screen.getByTestId('keep-button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-live', 'polite');
  });

  it('does not show icon when in loading state', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;
    render(<Button isLoading icon={<TestIcon />}>Loading With Icon</Button>);
    
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    
    // Check for spinner by its class instead of role
    const spinner = screen.getByText('', { selector: '.inline-block.mr-2.h-4.w-4[aria-hidden="true"]' });
    expect(spinner).toBeInTheDocument();
  });
}); 