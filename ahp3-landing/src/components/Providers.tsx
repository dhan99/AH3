'use client';

import { ReactNode } from 'react';
// Import MockAuthProvider instead of Auth0Provider
import { MockAuthProvider } from './MockAuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <MockAuthProvider>
      {children}
    </MockAuthProvider>
  );
};
