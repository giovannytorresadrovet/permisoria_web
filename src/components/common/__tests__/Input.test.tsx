import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders an input element with correct props', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    
    const label = screen.getByText('Email');
    expect(label).toBeInTheDocument();
  });

  it('shows required indicator when input is required', () => {
    render(<Input label="Email" required placeholder="Enter email" />);
    
    const label = screen.getByText('Email');
    expect(label.innerHTML).toContain('*');
  });

  it('displays helper text when provided', () => {
    render(<Input helperText="This is a hint" placeholder="Enter text" />);
    
    const helperText = screen.getByText('This is a hint');
    expect(helperText).toBeInTheDocument();
  });

  it('shows error message and sets aria-invalid when error is provided', () => {
    render(<Input error="This field is required" placeholder="Enter text" />);
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(<Input placeholder="Enter text" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Enter text');
    await user.type(input, 'Hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5); // One call per character
    expect(input).toHaveValue('Hello');
  });

  it('applies aria-describedby attribute correctly', () => {
    render(
      <Input 
        id="test-input"
        helperText="This is a hint" 
        placeholder="Enter text" 
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('aria-describedby');
    
    const helperId = input.getAttribute('aria-describedby');
    const helperText = document.getElementById(helperId!);
    expect(helperText).toHaveTextContent('This is a hint');
  });

  it('uses error id for aria-describedby when error is present', () => {
    render(
      <Input 
        id="test-input"
        helperText="This is a hint" 
        error="This is an error"
        placeholder="Enter text" 
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('aria-describedby');
    
    const errorId = input.getAttribute('aria-describedby');
    const errorText = document.getElementById(errorId!);
    expect(errorText).toHaveTextContent('This is an error');
  });

  it('renders a screen reader only label', () => {
    render(
      <Input 
        srOnlyLabel="Hidden label" 
        placeholder="Enter text" 
      />
    );
    
    const label = screen.getByText('Hidden label');
    expect(label).toHaveClass('sr-only');
  });

  it('renders a description text', () => {
    render(
      <Input 
        description="This is a detailed description"
        placeholder="Enter text" 
      />
    );
    
    const description = screen.getByText('This is a detailed description');
    expect(description).toBeInTheDocument();
  });

  it('prioritizes description over helper text for aria-describedby', () => {
    render(
      <Input 
        id="test-input"
        description="This is a description"
        helperText="This is a hint"
        placeholder="Enter text" 
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveAttribute('aria-describedby');
    
    const describedById = input.getAttribute('aria-describedby');
    const description = document.getElementById(describedById!);
    expect(description).toHaveTextContent('This is a description');
  });
}); 