import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

function SampleButton({ children }: { children: React.ReactNode }): React.ReactElement {
  return <button type="button">{children}</button>;
}

describe('Sample test', () => {
  it('renders a button with children', () => {
    render(<SampleButton>Click me</SampleButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
