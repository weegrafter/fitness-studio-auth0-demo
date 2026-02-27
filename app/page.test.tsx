import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

/**
 * Example test file to verify Vitest and Testing Library setup
 * 
 * Tests the Home page component to ensure:
 * - Component renders without errors
 * - Key content is present in the DOM
 */
describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    
    // Check if the main heading is rendered
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('displays the main heading text', () => {
    render(<Home />);
    
    // Verify the heading content
    const heading = screen.getByText(/To get started, edit the page.tsx file/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Home />);
    
    // Check for the presence of external links
    const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
    const docsLink = screen.getByRole('link', { name: /Documentation/i });
    
    expect(deployLink).toBeInTheDocument();
    expect(docsLink).toBeInTheDocument();
  });

  it('renders Next.js logo', () => {
    render(<Home />);
    
    // Check for Next.js logo image
    const logo = screen.getByAltText('Next.js logo');
    expect(logo).toBeInTheDocument();
  });
});
