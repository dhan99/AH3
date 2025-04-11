import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer Component', () => {
  it('renders copyright information', () => {
    render(<Footer />);
    
    // Check for copyright text
    const copyrightElement = screen.getByText(/© 2025 Intact Insurance Group USA LLC/i);
    expect(copyrightElement).toBeInTheDocument();
  });
  
  it('renders all footer links', () => {
    render(<Footer />);
    
    // Check for all footer links
    const legalLink = screen.getByText(/Legal/i);
    const privacyLink = screen.getByText(/Privacy/i);
    const compensationLink = screen.getByText(/Producer Compensation Disclosure/i);
    const underwritingLink = screen.getByText(/Underwriting Companies/i);
    
    expect(legalLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
    expect(compensationLink).toBeInTheDocument();
    expect(underwritingLink).toBeInTheDocument();
  });
  
  it('renders disclaimer text', () => {
    render(<Footer />);
    
    // Check for disclaimer text
    const disclaimerElement = screen.getByText(/Intact Insurance Specialty Solutions is the marketing brand/i);
    expect(disclaimerElement).toBeInTheDocument();
    
    // Check for rating information
    const ratingElement = screen.getByText(/\*Intact Insurance is backed by the financial strength/i);
    expect(ratingElement).toBeInTheDocument();
  });
});
